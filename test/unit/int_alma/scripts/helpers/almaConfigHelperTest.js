'use strict';

// almaConfigHelper.js unit tests

var assert = require('chai').assert;
var site = require('../../../../mocks/helpers/AlmaConfigHelpers').site;
var almaConfigHelpers = require('../../../../mocks/helpers/AlmaConfigHelpers').almaConfigHelpers;
var setCustomPreferenceValue = require('../../../../mocks/helpers/AlmaConfigHelpers').setCustomPreferenceValue;

describe('Get back-office variables', function () {
    describe('Deferred Capture', function () {
        it('should call site preferences with deferred capture key', function () {
            setCustomPreferenceValue(false);
            almaConfigHelpers.isDeferredCaptureEnable();

            assert.isTrue(site.getCurrent().getCustomPreferenceValue.calledOnce);
            assert.isTrue(site.getCurrent()
                .getCustomPreferenceValue
                .calledWith('ALMA_Deferred_Capture_Activation'));
        });
        it('should call site preferences and return default value', function () {
            setCustomPreferenceValue(false);
            assert.equal(false, almaConfigHelpers.isDeferredCaptureEnable());
        });

        it('should call site preferences with deferred capture event title key', function () {
            setCustomPreferenceValue('Shipping');
            almaConfigHelpers.getDeferredCaptureEventTitle();

            assert.isTrue(site.getCurrent().getCustomPreferenceValue.calledOnce);
            assert.isTrue(site.getCurrent()
                .getCustomPreferenceValue
                .calledWith('ALMA_Deferred_Capture_Event_Title'));
        });
        it('should call site preferences and return default value for event title', function () {
            setCustomPreferenceValue('Shipping');
            assert.equal('Shipping', almaConfigHelpers.getDeferredCaptureEventTitle());
        });
    });
});
