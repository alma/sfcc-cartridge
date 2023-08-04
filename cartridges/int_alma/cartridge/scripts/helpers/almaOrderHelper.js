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

/**
 * Set alma deferred capture in order
 * @param {Order} order order
 * @param {string} deferredCapture payDetail
 */
function setAlmaDeferredCapture(order, deferredCapture) {
    Transaction.wrap(function () {
        // eslint-disable-next-line no-param-reassign
        order.custom.ALMA_Deferred_Capture = deferredCapture;
    });
}

/**
 * Add Alma data to order
 * @param {string} pid payment id
 * @param {Object} order order
 * @param {boolean} isDeferredCapture is deferred capture
 * @throw Error
 */
function addAlmaDataToOrder(pid, order, isDeferredCapture) {
    addPidToOrder(order, pid);
    if (isDeferredCapture) {
        setAlmaDeferredCapture(order, 'toCapture');
    }
}


module.exports = {
    addPidToOrder: addPidToOrder,
    addAlmaPaymentDetails: addAlmaPaymentDetails,
    addAlmaDataToOrder: addAlmaDataToOrder,
    setAlmaDeferredCapture: setAlmaDeferredCapture
};
