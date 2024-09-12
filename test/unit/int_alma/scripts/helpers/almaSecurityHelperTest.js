'use strict';

// almaSecurityHelper.js unit tests

var assert = require('chai').assert;
var almaSecurityHelper = require('../../../../mocks/helpers/almaSecurityHelper').almaSecurityHelper;
var PAYMENT_ID = 'payment_id_test';
var API_KEY = 'api_key_test';
var BAD_SIGNATURE = 'bad_signature';
var GOOD_SIGNATURE = '4545854d3b8704d4b21cf88bc8b5da5680c46b2ab9d45c8cffe6278d8a8b1860';

describe('Alma security helper', function () {
    it('checkIpnSignature throw error without signature in header', function () {
        assert.throw(function () {
            almaSecurityHelper.checkIpnSignature(null, PAYMENT_ID, API_KEY);
        }, 'There is no signature in header');
    });

    it('checkIpnSignature throw error with bad signature', function () {
        assert.throw(function () {
            almaSecurityHelper.checkIpnSignature(BAD_SIGNATURE, PAYMENT_ID, '');
        }, 'Signature is not valid');
    });

    it('checkIpnSignature not throw error with good signature', function () {
        assert.doesNotThrow(function () {
            almaSecurityHelper.checkIpnSignature(GOOD_SIGNATURE, PAYMENT_ID, API_KEY);
        });
    });
});
