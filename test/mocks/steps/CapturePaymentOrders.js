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

var almaOrderHelper = {
    setAlmaDeferredCapture: sinon.stub()
};

var warnStub = sinon.stub();

var logger = {
    warn: warnStub,
    info: function () {}
};
var Order = {
    ORDER_STATUS_FAILED: 8,
    ORDER_STATUS_CANCELLED: 6
};

function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/steps/CapturePaymentOrders', {
        'dw/order/OrderMgr': OrderMgr,
        'dw/order/Order': Order,
        'dw/system/Logger': logger,
        'dw/system/Status': sinon.mock(),
        '*/cartridge/scripts/helpers/almaPaymentHelper': almaPaymentHelper,
        '*/cartridge/scripts/helpers/almaOrderHelper': almaOrderHelper
    });
}

module.exports = {
    CapturePaymentOrders: proxyModel(),
    OrderMgr: OrderMgr,
    almaPaymentHelper: almaPaymentHelper,
    almaOrderHelper: almaOrderHelper,
    warnStub: warnStub
};
