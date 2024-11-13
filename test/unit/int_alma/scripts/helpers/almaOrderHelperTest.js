// almaOrderHelper unit tests

var sinon = require('sinon');
var almaOrderHelper = require('../../../../mocks/helpers/almaOrderHelpers').almaOrderHelpers;
var transaction = require('../../../../mocks/helpers/almaOrderHelpers').transaction;
var createNewTransaction = require('../../../../mocks/helpers/almaOrderHelpers').createNewTransaction;
var order = {
    custom: {
        almaPaymentId: '',
        ALMA_Deferred_Capture_Status: ''
    }
};
describe('Alma order helper', function () {
    before(async function () {
        const chai = await import('chai');
        assert = chai.assert;
    });
    it('Add Alma data to order does not throw an error', function () {
        createNewTransaction();
        assert.doesNotThrow(function () {
            almaOrderHelper.addAlmaDataToOrder('payment_fake_id', order, true);
        });
    });

    it('Payment transaction.wrap is called twice; first for payment ID, then for Deferred Status', function () {
        createNewTransaction();
        almaOrderHelper.addAlmaDataToOrder('payment_fake_id', order, true);
        sinon.assert.calledTwice(transaction.wrap);
    });
});
