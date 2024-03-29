'use strict';

// almaOrderHelper unit tests

var assert = require('chai').assert;
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
