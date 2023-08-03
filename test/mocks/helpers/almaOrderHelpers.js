'use strict';
var sinon = require('sinon');
var proxyquire = require('proxyquire')
    .noCallThru()
    .noPreserveCache();
var stubCallback = sinon.stub();
var transaction = {
    wrap: stubCallback
};

function createNewTransaction() {
    stubCallback.reset();
}

function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/helpers/almaOrderHelper', {
        'dw/system/Transaction': transaction
    });
}

module.exports = {
    almaOrderHelpers: proxyModel(),
    transaction: transaction,
    createNewTransaction: createNewTransaction
};
