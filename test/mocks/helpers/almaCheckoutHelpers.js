var proxyquire = require('proxyquire')
    .noCallThru()
    .noPreserveCache();
var almaConfigHelpers = require('./almaConfigHelpers').almaConfigHelpers;
var almaHelpers = require('./almaHelpers');
var setCustomPreferenceValue = require('./almaConfigHelpers').setCustomPreferenceValue;

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
            getCustomPreferenceValue: function () {
                return true;
            }
        };
    }
};

var paymentMgr = {
    getPaymentMethod: function (str) {
        return {
            // eslint-disable-next-line consistent-return
            getCustom: function () {
                if (str === 'ALMA_PNX') {
                    return {
                        almaActivated: 'p3x | p4x'
                    };
                }
                if (str === 'ALMA_CREDIT') {
                    return {
                        almaActivated: 'p6x | p10x | p12x'
                    };
                }
                if (str === 'ALMA_DEFERRED') {
                    return {
                        almaActivated: 'd+15 | d+30'
                    };
                }
            }
        };
    }
};

var isAvailableForManualCapture;

function setIsAvailableForManualCapture(value) {
    isAvailableForManualCapture = value;
}

function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/helpers/almaCheckoutHelper', {
        'dw/web/Resource': resource,
        '*/cartridge/scripts/util/formatting': {
            formatCurrency: function (str) {
                return str;
            }
        },
        '*/cartridge/scripts/helpers/almaOnShipmentHelper': {
            isOnShipmentPaymentEnabled: function () {
                return false;
            }
        },
        'dw/system/Site': site,
        '*/cartridge/scripts/helpers/almaConfigHelper': almaConfigHelpers,
        '*/cartridge/scripts/helpers/almaHelpers': almaHelpers,
        'dw/order/PaymentMgr': paymentMgr,
        '*/cartridge/scripts/helpers/almaPaymentHelper': {
            isAvailableForManualCapture: function () {
                return isAvailableForManualCapture;
            }
        }
    });
}

module.exports = {
    almaCheckoutHelpers: proxyModel(),
    setCustomPreferenceValue: setCustomPreferenceValue,
    setIsAvailableForManualCapture: setIsAvailableForManualCapture
};
