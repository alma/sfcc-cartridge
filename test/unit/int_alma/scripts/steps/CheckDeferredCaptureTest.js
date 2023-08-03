// CheckDeferredCapture.js unit tests

var OrderMgr = require('../../../../mocks/steps/CheckDeferredCaptures').OrderMgr;
var almaPaymentHelper = require('../../../../mocks/steps/CheckDeferredCaptures').almaPaymentHelper;
var assert = require('chai').assert;
var checkDeferredCapture = require('../../../../mocks/steps/CheckDeferredCaptures').CheckDeferredCapture;

var sinon = require('sinon');

var order = {
    almaPaymentId: 'payment_12345'
};

var hasNext = sinon.stub();
hasNext.onCall(0)
    .returns(true);
hasNext.onCall(1)
    .returns(false);

var orders = {
    count: 1,
    hasNext: hasNext,
    next: function () {
        return order;
    }
};


describe('Deferred capture job', function () {
    it('Should get orders with deferred capture', function () {
        checkDeferredCapture.execute();
        assert.isTrue(OrderMgr.searchOrders.calledOnce);
        assert.isTrue(OrderMgr.searchOrders.calledWith("custom.ALMA_Deferred_Capture='true'", null));
    });

    it('Should call Capture for orders with deferred capture', function () {
        OrderMgr.searchOrders = sinon.stub().returns(orders);
        checkDeferredCapture.execute();
        var params = { external_id: 'payment_12345' };
        assert.isTrue(almaPaymentHelper.capturePayment.calledOnce);
        assert.isTrue(almaPaymentHelper.capturePayment.calledWith(params));
    });
});
