'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');
var almaOrderHelper = require('*/cartridge/scripts/helpers/almaOrderHelper');
var almaPaymentHelper = require('*/cartridge/scripts/helpers/almaPaymentHelper');
var Logger = require('dw/system/Logger');

exports.execute = function () {
    var Capture = almaPaymentHelper.Capture;
    var orders = OrderMgr.searchOrders(
        "custom.ALMA_Deferred_Capture_Status='ToCapture' and status != {0} and status != {1}",
        null,
        Order.ORDER_STATUS_FAILED,
        Order.ORDER_STATUS_CANCELLED
    );

    if (orders.count > 0) {
        while (orders.hasNext()) {
            var order = orders.next();
            var params = { external_id: order.custom.almaPaymentId };
            var amount = order.getTotalGrossPrice().value;
            var captureType = Capture.total;
            var partialCaptureAmount = almaOrderHelper.getPartialCaptureAmount(order);
            try {
                if (partialCaptureAmount) {
                    captureType = Capture.partial;
                    amount = partialCaptureAmount;
                }
                params.amount = amount * 100;
                var capture = almaPaymentHelper.capturePayment(params);
                almaOrderHelper.setAlmaDeferredCaptureFields(order, captureType.code, amount);
                Logger.info(captureType.description + ' payment: order id: {0} - payment id: {1} - capture id : {2}', [order.orderNo, order.custom.almaPaymentId, capture.id]);
            } catch (e) {
                almaOrderHelper.setAlmaDeferredCaptureFields(order, Capture.failed.code);
                Logger.warn(Capture.failed.description + ' payment: order id: {0}, payment id: {1}', [order.orderNo, order.custom.almaPaymentId]);
            }
        }
    }

    return new Status(Status.OK);
};
