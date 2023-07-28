'use strict';

var proxyquire = require('proxyquire')
    .noCallThru()
    .noPreserveCache();
var BasketMgr = require('../dw/order/BasketMgr');
var URLUtils = require('../dw/web/URLUtils');
var almaHelper = require('../helpers/almaHelpers');
var almaCheckoutHelper = require('../helpers/almaCheckoutHelpers');
var almaAddressHelper = require('../helpers/almaAddressHelper');
var almaOnShipmentHelper = require('../helpers/almaOnShipmentHelpers');

function proxyModel() {
    return proxyquire('../../../cartridges/int_alma/cartridge/scripts/helpers/almaPaymentHelper', {
        'dw/order/BasketMgr': BasketMgr,
        'dw/web/URLUtils': URLUtils,
        '*/cartridge/scripts/helpers/almaHelpers': almaHelper,
        '*/cartridge/scripts/helpers/almaCheckoutHelper': almaCheckoutHelper,
        '*/cartridge/scripts/helpers/almaAddressHelper': almaAddressHelper,
        '*/cartridge/scripts/helpers/almaOnShipmentHelper': almaOnShipmentHelper
    });
}

function resolvedPaymentData(installmentsCount, defferedDays, locale, origin, hasCart = false) {
    var paymentData = {
        payment: {
            purchase_amount: 25000,
            installments_count: installmentsCount,
            deferred_days: defferedDays,
            deferred_months: 0,
            return_url: '',
            ipn_callback_url: '',
            customer_cancel_url: '',
            locale: locale,
            origin: origin,
            shipping_address: {
                title: 'address.jobTitle',
                first_name: 'address.lastName',
                last_name: 'address.firstName',
                company: 'address.companyName',
                line1: 'address.address1',
                line2: 'address.address2',
                postal_code: 'address.postalCode',
                city: 'address.city',
                country: 'address.countryCode.value',
                state_province: 'address.stateCode',
                phone: 'address.phone'
            },
            billing_address: {
                title: 'address.jobTitle',
                first_name: 'address.lastName',
                last_name: 'address.firstName',
                company: 'address.companyName',
                line1: 'address.address1',
                line2: 'address.address2',
                postal_code: 'address.postalCode',
                city: 'address.city',
                country: 'address.countryCode.value',
                state_province: 'address.stateCode',
                phone: 'address.phone'
            },
            deferred: '',
            deferred_description: '',
            custom_data: {
                cms_name: 'SFCC',
                cms_version: '4.0.0',
                alma_plugin_version: '4.3.1'
            }
        },
        customer: {
            first_name: "'shippingAddress.first_name'",
            last_name: 'shippingAddress.last_name',
            email: 'customerEmail',
            phone: 'shippingAddress.phone'
        }
    };

    if (hasCart) {
        paymentData.payment.cart = {
            'items': []
        };
    }

    return paymentData;
}

module.exports = {
    proxyModel: proxyModel(),
    resolvedPaymentData: resolvedPaymentData
};
