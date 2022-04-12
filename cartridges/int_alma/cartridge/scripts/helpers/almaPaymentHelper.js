'use strict';

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
            return;
        }

        // place the order
        OrderMgr.placeOrder(order);
        order.setConfirmationStatus(Order.CONFIRMATION_STATUS_CONFIRMED);
        order.setExportStatus(Order.EXPORT_STATUS_READY);
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

/**
 * Calls the create payment endpoint
 * @param {Object} param to give to the payment endpoint
 * @returns {Object} api response
 */
function createPayment(param) {
    var service = require('*/cartridge/scripts/services/alma');

    var httpResult = service.createPayment().call(param);
    if (httpResult.msg !== 'OK') {
        throw new Error('API error : ' + httpResult.status);
    }
    return JSON.parse(httpResult.getObject().text);
}

/**
 * Build the data to give to the payment endpoint
 * @param {dw.order.Order} order the order to pay
 * @param {number} installmentsCount number of installments to pay
 * @param {number} deferredDays number of days to the first payment
 * @param {string} locale the user locale
 * @returns {Object} to give to the payment endpoint
 */
function buildPaymentData(order, installmentsCount, deferredDays, locale) {
    var BasketMgr = require('dw/order/BasketMgr');
    var URLUtils = require('dw/web/URLUtils');

    var formatAddress = require('*/cartridge/scripts/helpers/almaAddressHelper').formatAddress;
    var isOnShipmentPaymentEnabled = require('*/cartridge/scripts/helpers/almaOnShipmentHelper').isOnShipmentPaymentEnabled;
    var formatCustomerData = require('*/cartridge/scripts/helpers/almaHelpers').formatCustomerData;

    var currentBasket = BasketMgr.getCurrentBasket();
    var isEnableOnShipment = isOnShipmentPaymentEnabled(installmentsCount);
    var orderToken = order.getOrderToken();
    var orderId = order.orderNo;

    return {
        payment: {
            purchase_amount: Math.round(currentBasket.totalGrossPrice.multiply(100).value),
            installments_count: parseInt(installmentsCount, 10),
            deferred_days: parseInt(deferredDays, 10),
            deferred_months: 0,
            return_url: URLUtils.http('Alma-PaymentSuccess').toString(),
            ipn_callback_url: URLUtils.http('Alma-IPN').toString(),
            customer_cancel_url: URLUtils.https('Alma-CustomerCancel').toString(),
            locale: locale,
            origin: 'online',
            shipping_address: formatAddress(currentBasket.getDefaultShipment().shippingAddress),
            billing_address: formatAddress(currentBasket.getBillingAddress()),
            deferred: isEnableOnShipment ? 'trigger' : '',
            deferred_description: isEnableOnShipment ? require('dw/web/Resource').msg('alma.at_shipping', 'alma', null) : '',
            custom_data: {
                order_id: orderId,
                order_token: orderToken
            }
        },
        customer: formatCustomerData(currentBasket.getCustomer().profile, currentBasket.getCustomerEmail()),
        order: {
            merchant_reference: orderId
        }
    };
}


module.exports = {
    orderStatusEquals: orderStatusEquals,
    getPaymentObj: getPaymentObj,
    acceptOrder: acceptOrder,
    getPaymentDetails: getPaymentDetails,
    authorizePaymentProcessor: authorizePaymentProcessor,
    emptyCurrentBasket: emptyCurrentBasket,
    getOrderModel: getOrderModel,
    getUserProfile: getUserProfile,
    createOrderFromBasket: createOrderFromBasket,
    createPayment: createPayment,
    buildPaymentData: buildPaymentData
};
