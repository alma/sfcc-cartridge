'use strict';

var proxyquire = require('proxyquire')
    .noCallThru()
    .noPreserveCache();

var sinon = require('sinon');

var OrderMgr = {
    searchOrders: sinon.stub()
        .returns({})
};

var almaPaymentHelper = {
    capturePayment: sinon.stub()
};

function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/steps/CheckDeferredCapture', {
        'dw/order/OrderMgr': OrderMgr,
        '*/cartridge/scripts/helpers/almaPaymentHelper': almaPaymentHelper
    });
}

module.exports = {
    CheckDeferredCapture: proxyModel(),
    OrderMgr: OrderMgr,
    almaPaymentHelper: almaPaymentHelper
};
