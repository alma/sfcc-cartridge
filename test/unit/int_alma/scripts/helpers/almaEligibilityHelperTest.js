'use strict';

// almaEligibilityHelper.js unit tests

var assert = require('chai').assert;
var expect = require('chai').expect;
var almaEligibilityHelperMocks = require('../../../../mocks/helpers/almaEligibilityHelperMocks').almaEligibilityHelperMocks;
var basketMock = require('../../../../mocks/dw/order/BasketMgr');
var deferredCaptureEnabled = true;
var deferredCaptureDisabled = false;

var baseReturn =
    {
        purchase_amount: 25000,
        queries: [],
        locale: 'fr_FR',
        billing_address: {
            title: 'address.jobTitle',
            first_name: 'address.lastName',
            last_name: 'address.firstName',
            company: 'address.companyName',
            line1: 'address.address1',
            line2: 'address.address2',
            postal_code: 'address.postalCode',
            city: 'address.city',
            country: 'address.countryCode.value',
            state_province: 'address.stateCode',
            phone: 'address.phone'
        },
        shipping_address: {
            title: 'address.jobTitle',
            first_name: 'address.lastName',
            last_name: 'address.firstName',
            company: 'address.companyName',
            line1: 'address.address1',
            line2: 'address.address2',
            postal_code: 'address.postalCode',
            city: 'address.city',
            country: 'address.countryCode.value',
            state_province: 'address.stateCode',
            phone: 'address.phone'
        },
        capture_method: 'automatic'
    };

var baseBasket = basketMock.getCurrentBasket();
describe('Construct eligibility payload', function () {
    it('return a empty array for a null current bask', function () {
        var params = almaEligibilityHelperMocks.getParams([], 'fr_FR', null, deferredCaptureDisabled);
        // eslint-disable-next-line no-unused-expressions
        expect(params).to.be.an('array').that.is.empty;
    });
    it('Return full eligibility payload for a basket', function () {
        var params = almaEligibilityHelperMocks.getParams([], 'fr_FR', baseBasket, deferredCaptureDisabled);
        assert.deepEqual(
            params,
            baseReturn
        );
    });
    it('Return eligibility payload with capture method manual ', function () {
        var params = almaEligibilityHelperMocks.getParams([], 'fr_FR', baseBasket, deferredCaptureEnabled);
        baseReturn.capture_method = 'manual';
        assert.deepEqual(
            params,
            baseReturn
        );
    });
});

