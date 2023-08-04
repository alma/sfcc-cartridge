'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');
var almaOrderHelper = require('*/cartridge/scripts/helpers/almaOrderHelper');
var almaPaymentHelper = require('*/cartridge/scripts/helpers/almaPaymentHelper');
var Logger = require('dw/system/Logger');

exports.execute = function () {
    var orders = OrderMgr.searchOrders(
        "custom.ALMA_Deferred_Capture='toCapture' and status != {0} and status != {1}",
        null,
        Order.ORDER_STATUS_FAILED,
        Order.ORDER_STATUS_CANCELLED
    );
    var errors = [];

    if (orders.count > 0) {
        while (orders.hasNext()) {
            var order = orders.next();
            var params = { external_id: order.custom.almaPaymentId };

            try {
                var capture = almaPaymentHelper.capturePayment(params);
                almaOrderHelper.setAlmaDeferredCapture(order, 'Captured');
                Logger.info('Capture payment: order id: {0} - payment id: {1} - capture id : {2}', [order.orderNo, order.custom.almaPaymentId, capture.id]);
            } catch (e) {
                Logger.warn('Unable to capture payment: order id: {0}, payment id: {1}', [order.orderNo, order.custom.almaPaymentId]);
                errors.push(e);
            }
        }
    }

    if (errors.length > 0) {
        return new Status(Status.ERROR);
    }

    return new Status(Status.OK);
};
