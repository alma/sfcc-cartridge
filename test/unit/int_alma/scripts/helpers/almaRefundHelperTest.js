'use strict';

// refundHelpers.js unit tests

var order = {
    getTotalGrossPrice: function () {
        return 300;
    },
    orderNo: '00002222',
    custom: {
        almaRefundedAmount: 0,
        almaPaymentId: 'payment_11uXoLs39IVLHMMQytcRzfcqiM6pdGqjuC'
    }
};

var almaRefundHelpers = require('../../../../mocks/helpers/almaRefundHelpers');

describe('AlmaRefundHelpers', function () {
    let assert;
    let expect;
    before(async function () {
        const chai = await import('chai');
        assert = chai.assert;
        expect = chai.expect;
    });

    it('Order refunded amount is equal to total gross price for a total refund', function () {
        almaRefundHelpers.refundPaymentForOrder(order);
        assert.equal(order.custom.almaRefundedAmount, order.getTotalGrossPrice());
    });

    it('Refund throw an error when order is null', function () {
        expect(function () {
            almaRefundHelpers.refundPaymentForOrder();
        }).to.throw('Order not found');
    });

    it('Order refunded amount is equal to the partial refund', function () {
        order.custom.almaRefundedAmount = 0;
        almaRefundHelpers.refundPaymentForOrder(order, 10);
        assert.equal(order.custom.almaRefundedAmount, 10);
    });

    it('Partial refund with a negative amount throw an error', function () {
        expect(function () {
            almaRefundHelpers.refundPaymentForOrder(order, -10);
        }).to.throw('Amount can\'t be negative.');
    });

    it('Partial refund with an amount > to the total price throw an error', function () {
        expect(function () {
            almaRefundHelpers.refundPaymentForOrder(order, 5000);
        }).to.throw('Amount can\'t be upper than order total gross price.');
    });

    it('Order refunded amount is equal to 2 partial refund', function () {
        order.custom.almaRefundedAmount = 0;
        almaRefundHelpers.refundPaymentForOrder(order, 10);
        almaRefundHelpers.refundPaymentForOrder(order, 40);
        assert.equal(order.custom.almaRefundedAmount, 50);
    });

    it('2 partial refund more than total gross price throw an error', function () {
        order.custom.almaRefundedAmount = 0;
        almaRefundHelpers.refundPaymentForOrder(order, 250);
        expect(function () {
            almaRefundHelpers.refundPaymentForOrder(order, 100);
        }).to.throw('Amount can\'t be upper than order total gross price less refunded amount.');
    });

    it('Order refunded amount wanted goes back to 0 after refund', function () {
        almaRefundHelpers.refundPaymentForOrder(order);
        assert.equal(order.custom.almaWantedRefundAmount, 0);
    });
});
