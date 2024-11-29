var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');
var almaAddressHelper = require('../../mocks/helpers/almaAddressHelper');

var logger = {
    getLogger: function () {
        return {
            info: sinon.stub()
        };
    }
};

function proxyModel() {
    return proxyquire(
        '../../../cartridges/int_alma/cartridge/scripts/helpers/almaEligibilityHelper',
        {
            'dw/system/Logger': logger,
            '*/cartridge/scripts/helpers/almaAddressHelper': almaAddressHelper
        }
    );
}
module.exports = {
    almaEligibilityHelperMocks: proxyModel(),
    logger: logger
};
