// CapturePaymentOrders.js unit tests
var sinon = require('sinon');

var OrderMgr = require('../../../../mocks/steps/CapturePaymentOrders').OrderMgr;
var almaPaymentHelper = require('../../../../mocks/steps/CapturePaymentOrders').almaPaymentHelper;
var CapturePaymentOrders = require('../../../../mocks/steps/CapturePaymentOrders').CapturePaymentOrders;
var almaOrderHelper = require('../../../../mocks/steps/CapturePaymentOrders').almaOrderHelper;
var setPartialCaptureAmount = require('../../../../mocks/steps/CapturePaymentOrders').setPartialCaptureAmount;
var warnStub = require('../../../../mocks/steps/CapturePaymentOrders').warnStub;

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

function nextFactory(count) {
    var next = sinon.stub();

    for (var i = 0; i <= count; i++) {
        next.onCall(i)
            .returns({
                custom: {
                    almaPaymentId: 'payment_' + i
                },
                getTotalGrossPrice: sinon.stub().returns({ value: 100 })
            });
    }
    return next;
}

function mockOrderFactory(count) {
    return {
        count: count,
        hasNext: hasNextFactory(count),
        next: nextFactory(count)
    };
}


describe('Deferred capture job', function () {
    beforeEach(function () {
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(1));
        almaPaymentHelper.capturePayment = sinon.stub()
            .returns({ amount: 10000, id: 'capture_id' });
    });

    afterEach(function () {
        sinon.reset();
    });

    it('Should get orders with deferred capture', function () {
        CapturePaymentOrders.execute();

        sinon.assert.calledOnce(OrderMgr.searchOrders);
        // status : 8 failed - 6 canceled
        sinon.assert.calledWith(OrderMgr.searchOrders, "custom.ALMA_Deferred_Capture_Status='ToCapture' and status != {0} and status != {1}", null, 8, 6);
    });

    it('Should not call Capture where their is no order', function () {
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(0));

        CapturePaymentOrders.execute();

        sinon.assert.notCalled(almaPaymentHelper.capturePayment);
    });

    it('Should call Capture for orders with deferred capture', function () {
        var count = 10;
        OrderMgr.searchOrders = sinon.stub()
            .returns(mockOrderFactory(count));

        CapturePaymentOrders.execute();

        sinon.assert.callCount(almaPaymentHelper.capturePayment, count);
        for (var i = 0; i < count; i++) {
            sinon.assert.calledWith(almaPaymentHelper.capturePayment.getCall(i), { external_id: 'payment_' + i, amount: 10000 });
        }
    });

    it('Should set capture ID when capture is validated', function () {
        CapturePaymentOrders.execute();

        sinon.assert.calledOnce(almaOrderHelper.setAlmaDeferredCaptureFields);
        sinon.assert.calledWithMatch(
            almaOrderHelper.setAlmaDeferredCaptureFields,
            {},
            'Captured',
            100
        );
    });

    it('Should not call setAlmaDeferredCaptureFields when capture throw an error', function () {
        almaPaymentHelper.capturePayment = sinon.stub()
            .throws();

        CapturePaymentOrders.execute();

        sinon.assert.calledOnce(warnStub);
        sinon.assert.calledWithMatch(
            almaOrderHelper.setAlmaDeferredCaptureFields,
            {},
            'Failed'
        );
    });

    it('should get call capture with right amount and code for partial capture', function () {
        almaOrderHelper.getPartialCaptureAmount = sinon.stub().returns(25);
        CapturePaymentOrders.execute();

        sinon.assert.calledOnce(almaOrderHelper.setAlmaDeferredCaptureFields);
        sinon.assert.calledWithMatch(
            almaOrderHelper.setAlmaDeferredCaptureFields,
            {},
            'PartialCaptured',
            25
        );
    });
});

