// refundHelpers.js unit tests

var assert = require('chai').assert;

var order = {
    getTotalGrossPrice: function () {
        return 300;
    },
    orderNo: '00002222',
    custom: {
        ALMA_Refunded_Amount: 0,
        almaPaymentId: 'payment_11uXoLs39IVLHMMQytcRzfcqiM6pdGqjuC'
    }
};

var almaRefundHelpers = require('../../../../mocks/helpers/almaRefundHelpers');
var expect = require('chai').expect;

describe('almaRefundHelpers', function () {
    it('check properties', function () {
        almaRefundHelpers.refundPaymentForOrder(order);
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

    it('check ALMA_refunded_amount for partial refund', function () {
        order.custom.ALMA_Refunded_Amount = 0;
        almaRefundHelpers.refundPaymentForOrder(order, 10);
        assert.equal(order.custom.ALMA_Refunded_Amount, 10);
    });

    it('check ALMA_refunded_amount for 2 partial refund', function () {
        order.custom.ALMA_Refunded_Amount = 0;
        almaRefundHelpers.refundPaymentForOrder(order, 10);
        almaRefundHelpers.refundPaymentForOrder(order, 40);
        assert.equal(order.custom.ALMA_Refunded_Amount, 50);
    });

    it('2 partial refund more than total gross price', function () {
        order.custom.ALMA_Refunded_Amount = 0;
        almaRefundHelpers.refundPaymentForOrder(order, 250);
        expect(function () {
            almaRefundHelpers.refundPaymentForOrder(order, 100);
        })
            .to
            .throw('Amount can\'t be upper than order total gross price less refunded amount.');
    });

    it('check ALMA_refunded_amount for total refund', function () {
        order.custom.ALMA_Refunded_Amount = 0;
        almaRefundHelpers.refundPaymentForOrder(order);
        assert.equal(order.custom.ALMA_Refunded_Amount, order.getTotalGrossPrice());
    });
});
