var proxyquire = require('proxyquire')
    .noCallThru()
    .noPreserveCache();

var sinon = require('sinon');

var OrderMgr = {
    searchOrders: sinon.stub()
        .returns({})
};

var logger = {
    info: sinon.stub()
};

var refundHelper = {
    refundPaymentForOrder: sinon.stub()
};

var almaPaymentHelper = {
    cancelAlmaPayment: sinon.stub()
};

var transaction = {
    wrap: sinon.stub()
};

function proxyModel() {
    return proxyquire(
        '../../../cartridges/int_alma/cartridge/scripts/steps/CheckRefund',
        {
            'dw/system/Logger': logger,
            'dw/system/Status': sinon.mock(),
            'dw/order/OrderMgr': OrderMgr,
            '*/cartridge/scripts/helpers/almaRefundHelper': refundHelper,
            '*/cartridge/scripts/helpers/almaPaymentHelper': almaPaymentHelper,
            'dw/system/Transaction': transaction
        }
    );
}

module.exports = {
    CheckRefund: proxyModel(),
    OrderMgr: OrderMgr,
    refundHelper: refundHelper,
    almaPaymentHelper: almaPaymentHelper,
    logger: logger,
    transaction: transaction
};
