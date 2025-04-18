'use strict';

var sinon = require('sinon');

var OrderMgr = require('../../../../mocks/steps/CheckRefundMocks').OrderMgr;
var CheckRefund = require('../../../../mocks/steps/CheckRefundMocks').CheckRefund;
var refundHelper = require('../../../../mocks/steps/CheckRefundMocks').refundHelper;
var almaPaymentHelper = require('../../../../mocks/steps/CheckRefundMocks').almaPaymentHelper;
var logger = require('../../../../mocks/steps/CheckRefundMocks').logger;
var transaction = require('../../../../mocks/steps/CheckRefundMocks').transaction;

function orderFactory(count, refundType, partialRefundAmount, capture) {
    return {
        custom: {
            almaPaymentId: 'payment_' + count,
            almaRefundType: {
                toString: function () {
                    return refundType;
                }
            },
            almaWantedRefundAmount: partialRefundAmount,
            ALMA_Deferred_Capture_Status: capture
        },
        totalGrossPrice: {
            value: 10000
        },
        orderNo: 'order_id',
        getTotalGrossPrice: function () {
            return 10000;
        }
    };
}
function hasNextFactory(count) {
    var hasNext = sinon.stub();

    // TODO: Muting no-plusplus rule until we refactor more efficiently the code to match Node >=22
    // eslint-disable-next-line no-plusplus
    for (var i = 0; i <= count; i++) {
        if (i === count) {
            hasNext.onCall(i)
                .returns(false);
        } else {
            hasNext.onCall(i)
                .returns(true);
        }
    }
    return hasNext;
}

function nextFactory(count, refundType, partialRefundAmount, capture) {
    var next = sinon.stub();

    // TODO: Muting no-plusplus rule until we refactor more efficiently the code to match Node >=22
    // eslint-disable-next-line no-plusplus
    for (var i = 0; i <= count; i++) {
        next.onCall(i)
            .returns(orderFactory(i, refundType, partialRefundAmount, capture));
    }
    return next;
}

function mockOrderFactory(count, refundType, partialRefundAmount, capture) {
    return {
        count: count,
        hasNext: hasNextFactory(count),
        next: nextFactory(count, refundType, partialRefundAmount, capture)
    };
}
describe('Refund job test', function () {
    afterEach(function () {
        sinon.reset();
    });
    it('Should call refund once per order for Total Refund', function () {
        var count = 3;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count, 'Total', 10000, 'Captured'));

        CheckRefund.execute();
        sinon.assert.callCount(refundHelper.refundPaymentForOrder, count);
    });
    it('Should call refund for Total Refund with good params', function () {
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(1, 'Total', null, 'Captured'));

        CheckRefund.execute();
        sinon.assert.calledOnce(refundHelper.refundPaymentForOrder);
        sinon.assert.calledWith(
            refundHelper.refundPaymentForOrder,
            sinon.match(
                {
                    custom: {
                        almaPaymentId: 'payment_0'
                    },
                    totalGrossPrice: {
                        value: 10000
                    }
                }
            )
        );
    });
    it('Should call partial refund with good params', function () {
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(1, 'Partial', 3000, 'Captured'));

        CheckRefund.execute();

        sinon.assert.calledWith(
            refundHelper.refundPaymentForOrder,
            sinon.match(
                {
                    custom: {
                        almaPaymentId: 'payment_0',
                        almaWantedRefundAmount: 3000
                    },
                    totalGrossPrice: {
                        value: 10000
                    }
                }
            ),
            3000
        );
    });
    it('Should be not call for a partial refund with negative amount', function () {
        var count = 1;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count, 'Partial', -10000, 'Captured'));

        CheckRefund.execute();
        sinon.assert.notCalled(refundHelper.refundPaymentForOrder);
    });
    it('Should be not call for a partial refund with not a valid amount', function () {
        var count = 1;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count, 'Partial', 'azertyui', 'Captured'));

        CheckRefund.execute();
        sinon.assert.notCalled(refundHelper.refundPaymentForOrder);
    });
    it('Should be not call for a partial refund with an amount upper than the order amount', function () {
        var count = 1;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count, 'Partial', 1000000, 'Captured'));

        CheckRefund.execute();
        sinon.assert.notCalled(refundHelper.refundPaymentForOrder);
    });
    describe('Deferred payment', function () {
        it('Should call refund for an order whose payment is in auto capture', function () {
            OrderMgr.searchOrders = sinon.stub()
                .returns(mockOrderFactory(1, 'Total', null, 'Captured'));
            CheckRefund.execute();
            sinon.assert.calledOnce(refundHelper.refundPaymentForOrder);
        });
        it('Should call refund for an order whose payment is already captured for a total refund', function () {
            OrderMgr.searchOrders = sinon.stub()
                .returns(mockOrderFactory(1, 'Total', null, 'Captured'));
            CheckRefund.execute();
            sinon.assert.calledOnce(refundHelper.refundPaymentForOrder);
        });
        it('Should call refund for an order whose payment is already captured for a partial refund', function () {
            OrderMgr.searchOrders = sinon.stub()
                .returns(mockOrderFactory(1, 'Partial', 3000, 'Captured'));
            CheckRefund.execute();
            sinon.assert.calledOnce(refundHelper.refundPaymentForOrder);
        });
        it('Should call cancel for an order whose payment is ToCapture for a total refund', function () {
            OrderMgr.searchOrders = sinon.stub()
                .returns(mockOrderFactory(1, 'Total', null, 'ToCapture'));
            CheckRefund.execute();
            sinon.assert.notCalled(refundHelper.refundPaymentForOrder);
            sinon.assert.calledOnce(almaPaymentHelper.cancelAlmaPayment);
            sinon.assert.calledWith(almaPaymentHelper.cancelAlmaPayment, { external_id: 'payment_0' });
            sinon.assert.calledOnce(transaction.wrap);
        });
        it('Should not call cancel for an order whose payment is ToCapture for a Partial refund and write a error log', function () {
            OrderMgr.searchOrders = sinon.stub()
                .returns(mockOrderFactory(1, 'Partial', 3000, 'ToCapture'));
            CheckRefund.execute();
            sinon.assert.notCalled(refundHelper.refundPaymentForOrder);
            sinon.assert.notCalled(almaPaymentHelper.cancelAlmaPayment);
            sinon.assert.calledWith(logger.info, 'Partial refund is not yet implemented with deferred payment - order id {0}', ['order_id']);
            sinon.assert.calledOnce(transaction.wrap);
        });
    });
});
