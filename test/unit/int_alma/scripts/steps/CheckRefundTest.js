var sinon = require('sinon');

var OrderMgr = require('../../../../mocks/steps/CheckRefundMocks').OrderMgr;
var CheckRefund = require('../../../../mocks/steps/CheckRefundMocks').CheckRefund;
var refundHelper = require('../../../../mocks/steps/CheckRefundMocks').refundHelper;

function orderFactory(count, refundType, partialRefundAmount) {
    return {
        custom: {
            almaPaymentId: 'payment_' + count,
            almaRefundType: {
                toString: function () {
                    return refundType;
                }
            },
            almaWantedRefundAmount: partialRefundAmount
        },
        totalGrossPrice: {
            value: 10000
        }
    };
}
function hasNextFactory(count) {
    var hasNext = sinon.stub();

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

function nextFactory(count, refundType, partialRefundAmount) {
    var next = sinon.stub();

    for (var i = 0; i <= count; i++) {
        next.onCall(i)
            .returns(orderFactory(i, refundType, partialRefundAmount));
    }
    return next;
}

function mockOrderFactory(count, refundType, partialRefundAmount) {
    return {
        count: count,
        hasNext: hasNextFactory(count),
        next: nextFactory(count, refundType, partialRefundAmount)
    };
}
describe('Refund job test', function () {
    afterEach(function () {
        sinon.reset();
    });
    it('should call refund once per order for Total Refund', function () {
        var count = 3;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count, 'Total', 10000));

        CheckRefund.execute();
        sinon.assert.callCount(refundHelper.refundPaymentForOrder, count);
    });
    it('should call refund for Total Refund with good params', function () {
        var count = 1;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count, 'Total'));

        CheckRefund.execute();
        sinon.assert.callCount(refundHelper.refundPaymentForOrder, count);
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
    it('should call partial refund with good params', function () {
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(1, 'Partial', 3000));

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
    it('should be not call for a partial refund with negative amount', function () {
        var count = 1;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count, 'Partial', -10000));

        CheckRefund.execute();
        sinon.assert.notCalled(refundHelper.refundPaymentForOrder);
    });
    it('should be not call for a partial refund with not a valid amount', function () {
        var count = 1;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count, 'Partial', 'azertyui'));

        CheckRefund.execute();
        sinon.assert.notCalled(refundHelper.refundPaymentForOrder);
    });
    it('should be not call for a partial refund with an amount upper than the order amount', function () {
        var count = 1;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count, 'Partial', 1000000));

        CheckRefund.execute();
        sinon.assert.notCalled(refundHelper.refundPaymentForOrder);
    });
});
