const sinon = require('sinon');
var almaPaymentHelper = require('../../../cartridges/int_alma/cartridge/scripts/helpers/almaPaymentHelper');

var proxyquire = require('proxyquire')
    .noCallThru()
    .noPreserveCache();

var site = {
    getCurrent: function () {
        return {
            getCustomPreferenceValue: function () {
                return true;
            }
        };
    }
};

var logger = {
    getLogger: function () {
        return {
            warn: sinon.stub()
        };
    }
};

var isDeferredCaptureEnableValue;

function setIsDeferredCaptureEnable(value) {
    isDeferredCaptureEnableValue = value;
}

var almaConfigHelper = {
    isDeferredCaptureEnable: function () {
        return isDeferredCaptureEnableValue;
    }
};

function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/helpers/almaPlanHelper', {
        'dw/system/Site': site,
        'dw/system/Logger': logger,
        '*/cartridge/scripts/helpers/almaUtilsHelper': '',
        '*/cartridge/scripts/helpers/almaEligibilityHelper': '',
        '*/cartridge/scripts/helpers/almaCheckoutHelper': '',
        '*/cartridge/scripts/helpers/almaWidgetHelper': '',
        '*/cartridge/scripts/helpers/almaPaymentHelper': almaPaymentHelper,
        '*/cartridge/scripts/helpers/almaConfigHelper': almaConfigHelper
    });
}

module.exports = {
    almaPlanHelperMock: proxyModel(),
    setIsDeferredCaptureEnable: setIsDeferredCaptureEnable,
    logger: logger
};
