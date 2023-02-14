'use strict';

var Site = require('dw/system/Site');
var System = require('dw/system/System');
var logger = require('dw/system/Logger').getLogger('alma');
var pkg = require('../../../package.json');

/**
 * Builds SFCC current version.
 * @returns {string} current version.
 */
function getSfccVersion() {
    var sfccMajor = Math.trunc(System.getCompatibilityMode() / 100);
    var sfccMinor = (System.getCompatibilityMode() % 100) / 10;
    return sfccMajor + '.' + sfccMinor;
}

/**
 * Adds common headers to request
 * @param {dw.svc.Service} service - current service instance
 * @returns {dw.svc.Service} service
 */
function addHeaders(service) {
    var apiKey = Site.getCurrent().getCustomPreferenceValue('ALMA_APIKey');
    if (!apiKey) {
        logger.error('Alma api key is not configured');
        return service;
    }

    service.addHeader('Authorization', 'Alma-Auth ' + apiKey);
    service.addHeader('Content-Type', 'application/json');
    service.addHeader('User-Agent', 'SFCC/' + getSfccVersion() + '; Alma for SFCC/' + pkg.version);

    return service;
}

/**
 * Gets alma url from site preferences
 * @param {string} path url suffix (optional)
 * @returns {string} alma service url
 */
function getUrl(path) {
    if (typeof path === 'undefined') {
        path = ''; // eslint-disable-line no-param-reassign
    }

    var url = Site.getCurrent().getCustomPreferenceValue('ALMA_APIUrl') + path;

    if (!url) {
        logger.error('Alma URL is not configured');
        return '';
    }

    return url;
}

/**
 * Returns is Alma Enable
 * @returns {boolean} true or false
 */
function isAlmaEnable() {
    return Site.getCurrent().getCustomPreferenceValue('isAlmaEnable');
}

/**
 * Get merchant id from customer site preferences
 * @returns {string} json as string
 */
function getMerchantId() {
    return Site.getCurrent().getCustomPreferenceValue('ALMA_Merchant_Id');
}

/**
 * Returns is Alma On shipment Enable
 * @returns {boolean} true or false
 */
function isAlmaOnShipment() {
    return Site.getCurrent().getCustomPreferenceValue('ALMA_On_Shipment_Payment');
}

/**
 * Get mode
 * @returns {string} LIVE|TEST
 */
function getMode() {
    var urlTest = getUrl().split('sandbox');
    return urlTest.length === 1 ? 'LIVE' : 'TEST';
}

/**
 * Get customer data for init payment
 * @param {Object} profile customer profile
 * @param {string} customerEmail customer email
 * @param {string} shippingAddressPhone customer phone
 * @returns {Object} customer data
 */
function formatCustomerData(profile, customerEmail, shippingAddressPhone) {
    if (profile) {
        return {
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone: profile.phoneHome,
            email: profile.email
        };
    }
    return {
        email: customerEmail,
        phone: shippingAddressPhone
    };
}

/**
 * Return current Locale
 * @param {dw.system.Request} req the controller request
 * @returns {string} current locale
 */
function getLocale(req) {
    var Locale = require('dw/util/Locale');

    return Locale.getLocale(req.locale.id).toString();
}

module.exports = {
    addHeaders: addHeaders,
    formatCustomerData: formatCustomerData,
    getLocale: getLocale,
    getMerchantId: getMerchantId,
    getMode: getMode,
    getUrl: getUrl,
    isAlmaEnable: isAlmaEnable,
    isAlmaOnShipment: isAlmaOnShipment,
    getSfccVersion: getSfccVersion
};
