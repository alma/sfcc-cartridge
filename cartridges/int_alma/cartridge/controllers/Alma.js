'use strict';

var server = require('server');
var logger = require('dw/system/Logger').getLogger('alma');

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
    var almaPaymentHelper = require('*/cartridge/scripts/helpers/almaPaymentHelper');

    var orderModel = almaPaymentHelper.getOrderModel(order, localeId);

    var reportingURLs = reportingUrlsHelper.getOrderReportingURLs(order);

    var profile = almaPaymentHelper.getUserProfile(orderModel.orderEmail);

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
function affectOrder(paymentObj, order) {
    var Transaction = require('dw/system/Transaction');
    var OrderMgr = require('dw/order/OrderMgr');
    var Order = require('dw/order/Order');
    var almaPaymentHelper = require('*/cartridge/scripts/helpers/almaPaymentHelper');
    var acceptOrder = require('*/cartridge/scripts/helpers/almaPaymentHelper').acceptOrder;

    var orderTotal = Math.round(order.totalGrossPrice.multiply(100).value);

    if (paymentObj.purchase_amount !== orderTotal || !(paymentObj.state === 'in_progress' || paymentObj.state === 'paid')) {
        Transaction.wrap(function () {
            order.trackOrderChange('Total or status is wrong');
            OrderMgr.failOrder(order, true);
        });

        var reason = paymentObj.purchase_amount !== orderTotal ? 'amount_mismatch' : 'state_error';
        almaPaymentHelper.flagAsPotentialFraud(paymentObj.id, reason);
        logger.warn('Flag potential fraud id:{0} | reason:{1}', [paymentObj.id, reason]);
        throw new Error(reason);
    }

    var isOnShipmentPaymentEnabled = require('*/cartridge/scripts/helpers/almaOnShipmentHelper').isOnShipmentPaymentEnabled;
    var paymentStatus = isOnShipmentPaymentEnabled(paymentObj.installments_count) ? Order.PAYMENT_STATUS_NOTPAID : Order.PAYMENT_STATUS_PAID;
    acceptOrder(order, paymentStatus);
}

server.get('PaymentSuccess', function (req, res, next) {
    var Transaction = require('dw/system/Transaction');
    var OrderMgr = require('dw/order/OrderMgr');
    var paymentHelper = require('*/cartridge/scripts/helpers/almaPaymentHelper');
    var paymentObj = null;

    try {
        paymentObj = paymentHelper.getPaymentObj(req.querystring.pid);
    } catch (e) {
        res.setStatusCode(500);
        res.render('error', {
            message: 'Can not find any payment for this order. Your order will fail.'
        });
        return next();
    }
    var payDetail = paymentHelper.getPaymentDetails(paymentObj);

    var order = OrderMgr.searchOrder(
        'orderNo={0}',
        paymentObj.custom_data.order_id
    );

    // we probably should throw an error if we don't have an order
    if (order) {
        paymentHelper.authorizePaymentProcessor(order);
        try {
            affectOrder(paymentObj, order);
        } catch (e) {
            res.setStatusCode(500);
            res.render('error', {
                message: e.toString()
            });
            return next();
        }
    }
    paymentHelper.emptyCurrentBasket();

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
    var paymentHelper = require('*/cartridge/scripts/helpers/almaPaymentHelper');

    var paymentObj = null;
    try {
        paymentObj = paymentHelper.getPaymentObj(req.querystring.pid);
    } catch (e) {
        res.setStatusCode(500);
        res.render('error', {
            message: 'Can not find any payment for this order. Your order will fail.'
        });
        return next();
    }
    var payDetail = paymentHelper.getPaymentDetails(paymentObj);

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
        affectOrder(paymentObj, order);

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

server.get('BasketData', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var formatAddress = require('*/cartridge/scripts/helpers/almaAddressHelper').formatAddress;
    var isOnShipmentPaymentEnabled = require('*/cartridge/scripts/helpers/almaOnShipmentHelper').isOnShipmentPaymentEnabled;
    var formatCustomerData = require('*/cartridge/scripts/helpers/almaHelpers').formatCustomerData;

    var currentBasket = BasketMgr.getCurrentBasket();
    var profile = currentBasket.getCustomer().profile;

    res.json({
        shipping_address: formatAddress(currentBasket.getDefaultShipment().shippingAddress),
        billing_address: formatAddress(currentBasket.getBillingAddress()),
        customer: formatCustomerData(profile, currentBasket.getCustomerEmail()),
        isEnableOnShipment: isOnShipmentPaymentEnabled(req.querystring.installment),
        orderId: '',
        orderToken: ''
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

server.post('CreatePaymentUrl', server.middleware.https, function (req, res, next) {
    var getLocale = require('*/cartridge/scripts/helpers/almaHelpers').getLocale;
    var almaPaymentHelper = require('*/cartridge/scripts/helpers/almaPaymentHelper');

    var paymentData = almaPaymentHelper.buildPaymentData(
        req.querystring.installments,
        req.querystring.deferred_days,
        getLocale(req)
    );

    try {
        var result = almaPaymentHelper.createPayment(paymentData);
        res.json(result);
    } catch (e) {
        res.setStatusCode(500);
        res.render('error', {
            message: 'Could not create payment on Alma side'
        });
    }
    return next();
});

server.post(
    'Refund',
    server.middleware.https,
    function (req, res, next) {
        var OrderMgr = require('dw/order/OrderMgr');
        var refundHelper = require('*/cartridge/scripts/helpers/almaRefundHelper');
        var order = OrderMgr.searchOrder('orderNo={0}', req.querystring.id);
        var amount = req.querystring.amount;

        if (!order) {
            res.setStatusCode(404);
            res.json({
                error: 'Order not found'
            });
            return next();
        }

        try {
            res.json(refundHelper.refundPaymentForOrder(order, amount));
        } catch (e) {
            res.setStatusCode(500);
            res.json({
                error: e.message
            });
        }


        return next();
    }
);

module.exports = server.exports();
