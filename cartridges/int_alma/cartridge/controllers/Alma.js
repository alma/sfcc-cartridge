'use strict';

var server = require('server');

/**
 * Allow to check an order status
 * @param {dw.order.Order} order the order to check
 * @param {number} status status to check
 * @returns {bool} if the order is at the requested status
 */
function orderStatusEquals(order, status) {
    return parseInt(order.status, 10) === parseInt(status, 10);
}

/**
 * Return payment info from Alma API
 * @param {string} almaPaymentId PaymentId of an alma payment
 * @returns {Object} info from Alma API payment
 */
function getPaymentObj(almaPaymentId) {
    var service = require('*/cartridge/scripts/services/alma');

    var param = {
        method: 'GET',
        pid: almaPaymentId
    };

    var httpResult = service.getPaymentDetails().call(param);
    if (httpResult.msg !== 'OK') {
        throw new Error('API error');
    }
    return JSON.parse(httpResult.getObject().text);
}

/**
 * Once Alma API return a success for the Order payment, accept the Order
 * @param {dw.order.Order} order the order to accept
 * @param {bool} paymentStatus the payment status, should be PAYMENT_STATUS_NOTPAID if we use payment on shipment
 */
function acceptOrder(order, paymentStatus) {
    var Transaction = require('dw/system/Transaction');
    var OrderMgr = require('dw/order/OrderMgr');
    var Order = require('dw/order/Order');

    Transaction.wrap(function () {
        // if the order is still cancel, uncancel it
        if (orderStatusEquals(order, Order.ORDER_STATUS_FAILED)) {
            OrderMgr.undoFailOrder(order);
        }

        // ensure that the order need to be opened/placed
        if (!orderStatusEquals(order, Order.ORDER_STATUS_CREATED)) {
            var logger = require('dw/system/Logger').getLogger('alma');
            logger.info('[ALMA] order ' + (order.custom ? order.custom.almaPaymentId : '') + ' already placed (status : ' + order.status + ')');
            return;
        }

        // place the order
        OrderMgr.placeOrder(order);
        order.setConfirmationStatus(Order.CONFIRMATION_STATUS_CONFIRMED);
        order.setPaymentStatus(paymentStatus);
    });
}

/**
 * Return a string to describe a payment
 * @param {Object} paymentObj the payment to describe
 * @returns {string} describing a payment
 */
function getPaymentDetails(paymentObj) {
    var isOnShipmentPaymentEnabled = require('*/cartridge/scripts/helpers/almaOnShipmentHelper').isOnShipmentPaymentEnabled;
    var Calendar = require('dw/util/Calendar');
    var StringUtils = require('dw/util/StringUtils');
    var formatCurrency = require('*/cartridge/scripts/util/formatting').formatCurrency;

    if (isOnShipmentPaymentEnabled(paymentObj.installments_count)) {
        return 'onShipment';
    }
    var payDetail = '';
    var payPlan = paymentObj.payment_plan;
    for (var i = 0, l = payPlan.length; i < l; i++) {
        payDetail +=
            StringUtils.formatCalendar(
                new Calendar(new Date(payPlan[i].due_date * 1000)),
                'dd/MM/yyyy'
            ) +
            ': ' +
            formatCurrency(payPlan[i].purchase_amount / 100, 'EUR') +
            ' ' +
            payPlan[i].state +
            '  ';
    }
    return payDetail;
}

/**
 * Check if we have to launch a hook to autorize a payement processor
 *
 * @param {dw/order/Order} order the order linked with payment processor
 */
function authorizePaymentProcessor(order) {
    var PaymentMgr = require('dw/order/PaymentMgr');
    var HookMgr = require('dw/system/HookMgr');
    var forOf = require('*/cartridge/scripts/helpers/almaUtilsHelper').forOf;

    forOf(order.paymentInstruments, function (paymentInstrument) {
        if (paymentInstrument.paymentMethod === 'GIFT_CERTIFICATE') {
            var paymentProcessor = PaymentMgr.getPaymentMethod(
                paymentInstrument.paymentMethod
            ).paymentProcessor;

            HookMgr.callHook(
                'app.payment.processor.' + paymentProcessor.ID.toLowerCase(),
                'Authorize',
                order.orderNo,
                paymentInstrument,
                paymentProcessor
            );
        }
    });
}

/**
 * Allow to empty current basket
 */
function emptyCurrentBasket() {
    var forOf = require('*/cartridge/scripts/helpers/almaUtilsHelper').forOf;
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();

    if (currentBasket) {
        currentBasket.removeAllPaymentInstruments();
        var products = currentBasket.allProductLineItems;

        forOf(products, function (product) {
            currentBasket.removeProductLineItem(product);
        });
    }
}

/**
 * Return an OrderModel based on an Order
 * @param {dw/order/Order} order the current order
 * @param {string} localeId the local
 * @returns {OrderModel} the OrderModel
 */
function getOrderModel(order, localeId) {
    var Locale = require('dw/util/Locale');
    var OrderModel = require('*/cartridge/models/order');

    var config = {
        numberOfLineItems: '*'
    };
    var currentLocale = Locale.getLocale(localeId);

    var country = currentLocale ? currentLocale.country : 'FR';
    return new OrderModel(order, {
        config: config,
        countryCode: country,
        containerView: 'order'
    });
}

/**
 * Return an User profile based on email
 * @param {string} email the user email
 * @returns {Customer} the user profile
 */
function getUserProfile(email) {
    var CustomerMgr = require('dw/customer/CustomerMgr');
    return CustomerMgr.searchProfile('email={0}', email);
}

/**
 * Helper that build the view params for Alma controller
 * @param {Object} paymentObj the payment to describe
 * @param {dw/order/Order} order the current order
 * @param {string} localeId the local
 * @param {Customer|null} reqProfile profile given in the request
 * @returns {Object} the data to be given to the view
 */
function buildViewParams(paymentObj, order, localeId, reqProfile) {
    var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');

    var orderModel = getOrderModel(order, localeId);

    var reportingURLs = reportingUrlsHelper.getOrderReportingURLs(order);

    var profile = getUserProfile(orderModel.orderEmail);

    var isReturningCustomer = reqProfile || profile;

    var viewParams = {
        order: orderModel,
        returningCustomer: true,
        reportingURLs: reportingURLs,
        paymentObj: paymentObj
    };

    if (!isReturningCustomer) {
        var passwordForm = server.forms.getForm('newPasswords');
        passwordForm.clear();
        viewParams.passwordForm = passwordForm;
    }
    return viewParams;
}

/**
 * Ensure that Alma received the right amount and that SFCC order is sync'd
 * @param {Object} paymentObj the payment to describe
 * @param {dw/order/Order} order the current order
 */
function affectOrderIPN(paymentObj, order) {
    var Transaction = require('dw/system/Transaction');
    var OrderMgr = require('dw/order/OrderMgr');
    var Order = require('dw/order/Order');

    var orderTotal = Math.round(order.totalGrossPrice.multiply(100).value);

    if (paymentObj.purchase_amount !== orderTotal || !(paymentObj.state === 'in_progress' || paymentObj.state === 'paid')) {
        Transaction.wrap(function () {
            order.trackOrderChange('Total or status is wrong');
            OrderMgr.failOrder(order, true);
        });
        throw new Error('Total or status is wrong');
    }

    var isOnShipmentPaymentEnabled = require('*/cartridge/scripts/helpers/almaOnShipmentHelper').isOnShipmentPaymentEnabled;
    var paymentStatus = isOnShipmentPaymentEnabled(paymentObj.installments_count) ? Order.PAYMENT_STATUS_NOTPAID : Order.PAYMENT_STATUS_PAID;
    acceptOrder(order, paymentStatus);
}

server.get('PaymentSuccess', function (req, res, next) {
    var Transaction = require('dw/system/Transaction');
    var OrderMgr = require('dw/order/OrderMgr');
    var Order = require('dw/order/Order');
    var paymentObj = null;

    try {
        paymentObj = getPaymentObj(req.querystring.pid);
    } catch (e) {
        res.setStatusCode(500);
        res.render('error', {
            message: 'Can not find any payment for this order. Your order will fail.'
        });
        return next();
    }
    var payDetail = getPaymentDetails(paymentObj);

    var order = OrderMgr.searchOrder(
        'orderNo={0}',
        paymentObj.custom_data.order_id
    );

    // we probably should throw an error if we don't have an order
    if (order) {
        authorizePaymentProcessor(order);
        try {
            var isOnShipmentPaymentEnabled = require('*/cartridge/scripts/helpers/almaOnShipmentHelper').isOnShipmentPaymentEnabled;
            var paymentStatus = isOnShipmentPaymentEnabled(paymentObj.installments_count) ? Order.PAYMENT_STATUS_NOTPAID : Order.PAYMENT_STATUS_PAID;
            acceptOrder(order, paymentStatus);
        } catch (e) {
            res.setStatusCode(500);
            res.render('error', {
                message: e.toString()
            });
            return next();
        }
    }
    emptyCurrentBasket();

    Transaction.wrap(function () {
        order.custom.almaPaymentId = req.querystring.pid;
        order.custom.ALMA_ResponseDetails = payDetail;
    });

    res.render('checkout/confirmation/confirmation',
        buildViewParams(paymentObj, order, req.locale.id, req.currentCustomer.profile)
    );

    req.session.raw.custom.orderID = req.querystring.pid; // eslint-disable-line no-param-reassign

    return next();
});

server.get(
    'CustomerCancel',
    server.middleware.https,
    function (req, res, next) {
        var OrderMgr = require('dw/order/OrderMgr');
        var Transaction = require('dw/system/Transaction');

        var almaPaymentId = req.querystring.pid;
        var order = OrderMgr.searchOrder('custom.almaPaymentId={0}', almaPaymentId);

        if (!order) {
            res.redirect('Home-Show');
            return next();
        }

        Transaction.wrap(function () {
            OrderMgr.failOrder(order, true);
        });
        res.redirect('Cart-Show');
        return next();
    }
);

server.get('IPN', function (req, res, next) {
    var OrderMgr = require('dw/order/OrderMgr');
    var Transaction = require('dw/system/Transaction');

    var paymentObj = null;
    try {
        paymentObj = getPaymentObj(req.querystring.pid);
    } catch (e) {
        res.setStatusCode(500);
        res.render('error', {
            message: 'Can not find any payment for this order. Your order will fail.'
        });
        return next();
    }
    var payDetail = getPaymentDetails(paymentObj);

    var order = OrderMgr.getOrder(
        paymentObj.custom_data.order_id,
        paymentObj.custom_data.order_token
    );

    if (!order) {
        res.setStatusCode(500);
        res.json({
            error: 'Order is not created'
        });
        return next();
    }

    try {
        affectOrderIPN(paymentObj, order);

        Transaction.wrap(function () {
            order.custom.almaPaymentId = req.querystring.pid;
            order.custom.ALMA_ResponseDetails = payDetail;
        });
    } catch (e) {
        res.setStatusCode(500);
        res.json({
            error: e.toString()
        });
        return next();
    }

    res.setStatusCode(200);
    res.json({
        error: false,
        message: 'Order is placed'
    });
    return next();
});

/**
 * create an order from a Basket
 * @returns {dw.order.Order} the created order
 */
function createOrderFromBasket() {
    var PaymentMgr = require('dw/order/PaymentMgr');
    var BasketMgr = require('dw/order/BasketMgr');
    var OrderMgr = require('dw/order/OrderMgr');
    var Transaction = require('dw/system/Transaction');
    var COHelpers = require('*/cartridge/scripts/checkout/checkoutHelpers');

    var currentBasket = BasketMgr.getCurrentBasket();

    Transaction.wrap(function () {
        currentBasket.removeAllPaymentInstruments();
        var paymentProcessor = PaymentMgr.getPaymentMethod('ALMA').paymentProcessor;
        var paymentInstrument = currentBasket.createPaymentInstrument(
            'ALMA',
            currentBasket.totalGrossPrice
        );

        paymentInstrument.paymentTransaction.setPaymentProcessor(
            paymentProcessor
        );
    });
    var order = COHelpers.createOrder(currentBasket);

    Transaction.wrap(function () {
        OrderMgr.failOrder(order, true);
    });
    return order;
}

server.get('BasketData', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var formatAddress = require('*/cartridge/scripts/helpers/almaAddressHelper').formatAddress;
    var isOnShipmentPaymentEnabled = require('*/cartridge/scripts/helpers/almaOnShipmentHelper').isOnShipmentPaymentEnabled;
    var formatCustomerData = require('*/cartridge/scripts/helpers/almaHelpers').formatCustomerData;

    var currentBasket = BasketMgr.getCurrentBasket();
    var profile = currentBasket.getCustomer().profile;

    var order = null;
    if (req.querystring.oid) {
        var OrderMgr = require('dw/order/OrderMgr');
        order = OrderMgr.searchOrder('orderNo={0}', req.querystring.oid);
    }

    if (!order) {
        order = createOrderFromBasket();
    }

    var orderToken = order.getOrderToken();
    var orderId = order.orderNo;

    res.json({
        shipping_address: formatAddress(currentBasket.getDefaultShipment().shippingAddress),
        billing_address: formatAddress(currentBasket.getBillingAddress()),
        customer: formatCustomerData(profile, currentBasket.getCustomerEmail()),
        isEnableOnShipment: isOnShipmentPaymentEnabled(req.querystring.installment),
        orderId: orderId,
        orderToken: orderToken
    });

    return next();
});

server.get('OrderAmount', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();
    res.json({
        purchase_amount: Math.round(currentBasket.totalGrossPrice.multiply(100).value)
    });

    return next();
});

module.exports = server.exports();
