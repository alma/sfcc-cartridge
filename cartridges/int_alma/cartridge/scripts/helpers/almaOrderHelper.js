'use strict';

var Transaction = require('dw/system/Transaction');

/**
 * Add PID to order
 * @param {Order} order order
 * @param {string} pid pid
 */
function addPidToOrder(order, pid) {
    Transaction.wrap(function () {
        // eslint-disable-next-line no-param-reassign
        order.custom.almaPaymentId = pid;
    });
}

/**
 * Add alma payment details in order
 * @param {Order} order order
 * @param {string} payDetail payDetail
 */
function addAlmaPaymentDetails(order, payDetail) {
    Transaction.wrap(function () {
        // eslint-disable-next-line no-param-reassign
        order.custom.ALMA_ResponseDetails = payDetail;
    });
}


module.exports = {
    addPidToOrder: addPidToOrder,
    addAlmaPaymentDetails: addAlmaPaymentDetails
};
