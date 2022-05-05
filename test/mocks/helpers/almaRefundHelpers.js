'use strict';


var proxyquire = require('proxyquire')
    .noCallThru()
    .noPreserveCache();

var transaction = {
    wrap: function (callBack) {
        return callBack.call();
    }
};

var alma = {
    refundPayment: function () {
        return function () {
            return {
                msg: 'OK',
                call: function () {
                }
            };
        };
    }
};

function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/helpers/almaRefundHelper', {
        'dw/system/Transaction': transaction,
        '*/cartridge/scripts/services/alma': alma
    });
}

module.exports = proxyModel();
