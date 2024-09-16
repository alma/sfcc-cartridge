'use strict';

var proxyquire = require('proxyquire')
    .noCallThru()
    .noPreserveCache();

function mac() {
    return {
        digest: function () {
            return 'good_byte_signature';
        }
    };
}

var encoding = {
    toHex: function () {
        return '4545854d3b8704d4b21cf88bc8b5da5680c46b2ab9d45c8cffe6278d8a8b1860';
    }
};

function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/helpers/almaSecurityHelper', {
        'dw/crypto/Mac': mac,
        'dw/crypto/Encoding': encoding
    });
}

module.exports = {
    almaSecurityHelper: proxyModel()
};
