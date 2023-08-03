'use strict';

var OrderMgr = require('dw/order/OrderMgr');
var almaPaymentHelper = require('*/cartridge/scripts/helpers/almaPaymentHelper');

exports.execute = function () {
    var orders = OrderMgr.searchOrders("custom.ALMA_Deferred_Capture='true'", null);

    if (orders.count > 0) {
        while (orders.hasNext()) {
            var order = orders.next();
            var params = { external_id: order.almaPaymentId };
            almaPaymentHelper.capturePayment(params);
        }
    }
};
