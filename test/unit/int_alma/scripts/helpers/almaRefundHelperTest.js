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
    it('when order is null', function () {
        var refundData = almaRefundHelpers.refundPaymentForOrder();
        assert.equal(refundData, 'Order don\'t exist.');
    });
    it('partial refund', function () {
        var refundData = almaRefundHelpers.refundPaymentForOrder(order, 10);
        assert.equal(refundData, 'Refund is ok for the order n°' + order.orderNo);
    });
    it('partial refund with a negative amount', function () {
        var refundData = almaRefundHelpers.refundPaymentForOrder(order, -10);
        assert.equal(refundData, 'Amount can\'t be negative.');
    });
    it('partial refund with an amount > to the total price', function () {
        var refundData = almaRefundHelpers.refundPaymentForOrder(order, 5000);
        assert.equal(refundData, 'Amount can\'t be upper than order total gross price.');
    });
});
