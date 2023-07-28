'use strict';

// almaPayment.js unit tests

var assert = require('chai').assert;
var almaPaymentHelper = require('../../../../mocks/helpers/almaPaymentHelpers').proxyModel;
var resolvedPaymentData = require('../../../../mocks/helpers/almaPaymentHelpers').resolvedPaymentData;

describe('almaPaymentHelper', function () {
    describe('Build payment data', function () {
        it('payment data for pnx', function () {
            var payment = almaPaymentHelper.buildPaymentData(3, 0, 'fr_FR');
            assert.deepEqual(payment, resolvedPaymentData(3, 0, 'fr_FR', 'online_in_page'));
        });
        it('payment data for deferred', function () {
            var payment = almaPaymentHelper.buildPaymentData(1, 15, 'fr_FR');
            assert.deepEqual(payment, resolvedPaymentData(1, 15, 'fr_FR', 'online'));
        });
        it('payment data for credit has car property', function () {
            var payment = almaPaymentHelper.buildPaymentData(12, 0, 'fr_FR');
            assert.deepEqual(payment, resolvedPaymentData(12, 0, 'fr_FR', 'online', true));
        });
    });
});
