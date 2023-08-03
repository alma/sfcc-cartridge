'use strict';

// almaPayment.js unit tests

var assert = require('chai').assert;
var almaPaymentHelper = require('../../../../mocks/helpers/almaPaymentHelpers').proxyModel;
var resolvedPaymentData = require('../../../../mocks/helpers/almaPaymentHelpers').resolvedPaymentData;
var service = require('../../../../mocks/helpers/almaPaymentHelpers').service;
var setHttpReturnStatusCode = require('../../../../mocks/helpers/almaPaymentHelpers').setHttpReturnStatusCode;

describe('almaPaymentHelper', function () {
    describe('Build payment data', function () {
        it('payment data for pnx', function () {
            var payment = almaPaymentHelper.buildPaymentData(3, 0, 'fr_FR', false);
            assert.deepEqual(payment, resolvedPaymentData(3, 0, 'fr_FR', 'online_in_page'));
        });
        it('payment data for deferred', function () {
            var payment = almaPaymentHelper.buildPaymentData(1, 15, 'fr_FR', false);
            assert.deepEqual(payment, resolvedPaymentData(1, 15, 'fr_FR', 'online'));
        });
        it('payment data for credit has car property', function () {
            var payment = almaPaymentHelper.buildPaymentData(12, 0, 'fr_FR', false);
            assert.deepEqual(payment, resolvedPaymentData(12, 0, 'fr_FR', 'online', true));
        });
    });
    describe('Build payment data for deferred capture', function () {
        it('Payment data for pnx has not capture method if deferred capture is not enabled', function () {
            var payment = almaPaymentHelper.buildPaymentData(3, 0, 'fr_FR', false);
            assert.notProperty(payment.payment, 'capture_method');
        });
        it('Payment data for pnx has capture method', function () {
            var payment = almaPaymentHelper.buildPaymentData(3, 0, 'fr_FR', true);
            assert.property(payment.payment, 'capture_method');
        });
        it('Payment data for credit has no capture method in', function () {
            var payment = almaPaymentHelper.buildPaymentData(12, 0, 'fr_FR', false);
            assert.notProperty(payment.payment, 'capture_method');
        });
        it('Payment data for pay now has capture method', function () {
            var payment = almaPaymentHelper.buildPaymentData(1, 0, 'fr_FR', true);
            assert.property(payment.payment, 'capture_method');
        });
        it('Payment data for pay later has no capture method', function () {
            var payment = almaPaymentHelper.buildPaymentData(1, 15, 'fr_FR', false);
            assert.notProperty(payment.payment, 'capture_method');
        });
    });

    describe('Capture endpoint', function () {
        it('Capture endpoint is call with the Alma payment external_id', function () {
            setHttpReturnStatusCode('OK');
            var params = { external_id: 'payment_12345' };
            assert.doesNotThrow(function () {
                almaPaymentHelper.capturePayment(params);
            });
            assert.isTrue(service.captures().call.calledOnce);
            assert.isTrue(service.captures()
                .call
                .calledWith(params));
        });

        it('Capture endpoint throw an error if http status code not equal 201', function () {
            setHttpReturnStatusCode(400);
            var params = { external_id: 'payment_12345' };
            assert.throws(function () {
                almaPaymentHelper.capturePayment(params);
            });
        });
    });
});
