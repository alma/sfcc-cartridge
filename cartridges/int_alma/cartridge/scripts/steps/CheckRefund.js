'use strict';

/**
 * Check if we should refund the payment
 * @param {dw.order.Order} order to be paid
 * @returns {bool} should we refund this order payment
 */
function isOrderToBeRefund(order) {
    return (
        order.custom.ALMA_Refund_Type.toString() === 'Total'
        || (order.custom.ALMA_Refund_Type.toString() === 'Partial'
            && order.custom.ALMA_Wanted_Refund_Amount > 0
            && order.custom.ALMA_Wanted_Refund_Amount < order.totalGrossPrice.value)
    );
}

/**
 * Query SFCC orders to fetch the Order that have been shipped and have the onShipment flag
 * @returns {dw.util.SeekableIterator} a collection of Order
 */
function getOrdersRefunded() {
    var OrderMgr = require('dw/order/OrderMgr');

    return OrderMgr.searchOrders(
        'paymentStatus = {0} and custom.ALMA_Refund_Type != NULL and custom.ALMA_Wanted_Refund_Amount > 0 and custom.almaPaymentId != NULL', null, 2
    );
}

exports.execute = function () {
    var Logger = require('dw/system/Logger');
    var Status = require('dw/system/Status');
    var orders = getOrdersRefunded();
    var errors = [];
    var refundHelper = require('*/cartridge/scripts/helpers/almaRefundHelper');

    Logger.info('[INFO][ALMA refund] job launched for: ' + orders.count + ' orders.');
    if (orders.count > 0) {
        while (orders.hasNext()) {
            var orderItem = orders.next();
            if (isOrderToBeRefund(orderItem)) {
                try {
                    refundHelper.refundPaymentForOrder(orderItem, orderItem.custom.ALMA_Wanted_Refund_Amount);
                    orderItem.custom.ALMA_Wanted_Refund_Amount = 0;
                } catch (e) {
                    Logger.error('[ERROR][ALMA refund] : ' + e);
                    errors.push(e);
                }
            }
        }
    }

    if (errors.length > 0) {
        return new Status(Status.ERROR);
    }

    return new Status(Status.OK);
};
