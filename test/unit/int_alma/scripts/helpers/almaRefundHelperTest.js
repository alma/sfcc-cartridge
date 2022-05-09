// refundHelpers.js unit tests

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
var expect = require('chai').expect;

describe('almaRefundHelpers', function () {
    it('check properties', function () {
        almaRefundHelpers.refundPaymentForOrder(order);
        // assert no exception is thrown there
    });

    it('when order is null', function () {
        expect(function () {
            almaRefundHelpers.refundPaymentForOrder();
        })
            .to
            .throw('Order not found');
    });

    it('partial refund', function () {
        almaRefundHelpers.refundPaymentForOrder(order, 10);
    });

    it('partial refund with a negative amount', function () {
        expect(function () {
            almaRefundHelpers.refundPaymentForOrder(order, -10);
        })
            .to
            .throw('Amount can\'t be negative.');
    });

    it('partial refund with an amount > to the total price', function () {
        expect(function () {
            almaRefundHelpers.refundPaymentForOrder(order, 5000);
        })
            .to
            .throw('Amount can\'t be upper than order total gross price.');
    });
});
