'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var Status = require('dw/system/Status');
var almaOrderHelper = require('*/cartridge/scripts/helpers/almaOrderHelper');
var almaPaymentHelper = require('*/cartridge/scripts/helpers/almaPaymentHelper');
var logger = require('dw/system/Logger')
    .getLogger('alma');

exports.execute = function () {
    var orders = OrderMgr.searchOrders("custom.ALMA_Deferred_Capture='toBeCaptured'", null);
    var errors = [];

    if (orders.count > 0) {
        while (orders.hasNext()) {
            var order = orders.next();
            var params = { external_id: order.custom.almaPaymentId };

            try {
                var capture = almaPaymentHelper.capturePayment(params);
                almaOrderHelper.setAlmaDeferredCapture(order, capture.id);
                logger.warn('Capture payment: order id: {0}, payment id: {1}', [order.orderNo, order.custom.almaPaymentId]);
            } catch (e) {
                logger.warn('Unable to capture payment: order id: {0}, payment id: {1}', [order.orderNo, order.custom.almaPaymentId]);
                errors.push(e);
            }
        }
    }

    if (errors.length > 0) {
        return new Status(Status.ERROR);
    }

    return new Status(Status.OK);
};
