// refundHelpers.js unit tests

var assert = require('chai').assert;

var order = {
    getTotalGrossPrice: function () {
        return 300;
    },
    orderNo: '00002222',
    custom: {
        almaPaymentId: 'payment_11uXoLs39IVLHMMQytcRzfcqiM6pdGqjuC'
    }
};

var almaRefundHelpers = require('../../../../mocks/helpers/almaRefundHelpers');

describe('almaRefundHelpers', function () {
    it('check properties', function () {
        var refundData = almaRefundHelpers.refundPaymentForOrder(order);
        assert.equal(refundData, 'Refund is ok for the order n°' + order.orderNo);
    });
});
