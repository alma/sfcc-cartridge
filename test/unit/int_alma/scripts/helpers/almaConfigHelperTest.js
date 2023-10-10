'use strict';

// almaConfigHelper.js unit tests

var assert = require('chai').assert;
var site = require('../../../../mocks/helpers/almaConfigHelpers').site;
var almaConfigHelpers = require('../../../../mocks/helpers/almaConfigHelpers').almaConfigHelpers;
var setCustomPreferenceValue = require('../../../../mocks/helpers/almaConfigHelpers').setCustomPreferenceValue;

describe('Get back-office variables', function () {
    describe('Deferred Capture', function () {
        it('should call site preferences with deferred capture key', function () {
            setCustomPreferenceValue(true);
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
    });
});
