// CapturePaymentOrders.js unit tests
var sinon = require('sinon');

var OrderMgr = require('../../../../mocks/steps/CapturePaymentOrders').OrderMgr;
var almaPaymentHelper = require('../../../../mocks/steps/CapturePaymentOrders').almaPaymentHelper;
var CapturePaymentOrders = require('../../../../mocks/steps/CapturePaymentOrders').CapturePaymentOrders;
var almaOrderHelper = require('../../../../mocks/steps/CapturePaymentOrders').almaOrderHelper;
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
                }
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
        sinon.assert.calledWith(OrderMgr.searchOrders, "custom.ALMA_Deferred_Capture='toBeCaptured'", null);
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
            sinon.assert.calledWith(almaPaymentHelper.capturePayment.getCall(i), { external_id: 'payment_' + i });
        }
    });

    it('Should set capture ID when capture is validated', function () {
        CapturePaymentOrders.execute();

        sinon.assert.calledOnce(almaOrderHelper.setAlmaDeferredCapture);
    });

    it('Should not call setAlmaDeferredCapture when capture throw an error', function () {
        almaPaymentHelper.capturePayment = sinon.stub()
            .throws();

        CapturePaymentOrders.execute();

        sinon.assert.calledOnce(warnStub);
        sinon.assert.notCalled(almaOrderHelper.setAlmaDeferredCapture);
    });
});

