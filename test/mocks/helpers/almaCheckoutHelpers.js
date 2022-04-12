'use strict';


var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var resource = {
    msg: function (param1) {
        return param1;
    },
    msgf: function (param1) {
        return param1;
    }
};

var site = {
    getCurrent: function () {
        return {
            getCustomPreferenceValue: function (str) {
                return true;
            }
        };
    }
};


function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/helpers/almaCheckoutHelper', {
        'dw/web/Resource': resource,
        '*/cartridge/scripts/util/formatting': { formatCurrency: function (str) { return str; } },
        '*/cartridge/scripts/helpers/almaOnShipmentHelper': { isOnShipmentPaymentEnabled: function (installmentsCount, deferredDays) { return false; } },
        'dw/system/Site': site
    });
}

module.exports = proxyModel();
