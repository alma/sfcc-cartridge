'use strict';

// almaOrderHelper unit tests

var assert = require('chai').assert;
var almaOrderHelper = require('../../../../mocks/helpers/almaOrderHelpers').almaOrderHelpers;
var transaction = require('../../../../mocks/helpers/almaOrderHelpers').transaction;
var createNewTransaction = require('../../../../mocks/helpers/almaOrderHelpers').createNewTransaction;
var order = {
    custom: {
        almaPaymentId: '',
        ALMA_Deferred_Capture: ''
    }
};
describe('Alma order helper', function () {
    it('Add Alma data to order does not throw an error', function () {
        createNewTransaction();
        assert.doesNotThrow(function () {
            almaOrderHelper.addAlmaDataToOrder('payment_fake_id', order, true);
        });
    });
    it('For a non deferred capture payment transaction is called once', function () {
        createNewTransaction();
        almaOrderHelper.addAlmaDataToOrder('payment_fake_id', order, false);
        // Wrap is called twice for one save
        assert.isTrue(transaction.wrap.calledOnce);
    });
    it('For a deferred capture payment transaction is called twice', function () {
        createNewTransaction();
        almaOrderHelper.addAlmaDataToOrder('payment_fake_id', order, true);
        // Wrap is called twice for one save
        assert.isTrue(transaction.wrap.calledTwice);
    });
});
