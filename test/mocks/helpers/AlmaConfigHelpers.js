'use strict';

var proxyquire = require('proxyquire')
    .noCallThru()
    .noPreserveCache();
var sinon = require('sinon');

var getCustomPreferenceValue;
var site = {
    getCurrent: function () {
        return {
            getCustomPreferenceValue: getCustomPreferenceValue
        };
    }
};

function setCustomPreferenceValue(preferenceKey) {
    getCustomPreferenceValue = sinon.stub()
        .returns(preferenceKey);
}

function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/helpers/almaConfigHelper', {
        'dw/system/Site': site
    });
}

module.exports = {
    almaConfigHelpers: proxyModel(),
    site: site,
    setCustomPreferenceValue: setCustomPreferenceValue
};
