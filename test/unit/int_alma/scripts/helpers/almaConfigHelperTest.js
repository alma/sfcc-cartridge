// almaConfigHelper.js unit tests

var site = require('../../../../mocks/helpers/almaConfigHelpers').site;
var almaConfigHelpers = require('../../../../mocks/helpers/almaConfigHelpers').almaConfigHelpers;
var setCustomPreferenceValue = require('../../../../mocks/helpers/almaConfigHelpers').setCustomPreferenceValue;

describe('Get back-office variables', function () {
    before(async function () {
        const chai = await import('chai');
        assert = chai.assert;
    });

    describe('Deferred Capture', function () {
        it('Should call site preferences with deferred capture key', function () {
            setCustomPreferenceValue(true);
            almaConfigHelpers.isDeferredCaptureEnable();

            assert.isTrue(site.getCurrent().getCustomPreferenceValue.calledOnce);
            assert.isTrue(site.getCurrent()
                .getCustomPreferenceValue
                .calledWith('ALMA_Deferred_Capture_Activation'));
        });
        it('Should call site preferences and return default value', function () {
            setCustomPreferenceValue(false);
            assert.equal(false, almaConfigHelpers.isDeferredCaptureEnable());
        });
    });
});
