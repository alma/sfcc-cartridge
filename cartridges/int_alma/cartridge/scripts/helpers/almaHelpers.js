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
 * @param {Object} shippingAddress shipping address
 * @returns {Object} customer data
 */
function formatCustomerData(profile, customerEmail, shippingAddress) {
    if (profile) {
        var phone = profile.phoneMobile ? profile.phoneMobile : profile.phoneHome;
        return {
            first_name: profile.firstName,
            last_name: profile.lastName,
            phone: phone,
            email: profile.email
        };
    }
    return {
        first_name: shippingAddress.first_name,
        last_name: shippingAddress.last_name,
        email: customerEmail,
        phone: shippingAddress.phone
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

/**
 * Check if the product’s category is excluded
 * @param {array} productIds product id
 * @return {boolean} return a boolean
 */
function haveExcludedCategory(productIds) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var categoriesID = [];

    productIds.forEach(function (productId) {
        var product = ProductMgr.getProduct(productId);

        if (product.isMaster()) {
            product.getAllCategories().toArray().forEach(function (category) {
                categoriesID.push(category.getID());
            });
        } else {
            product.getMasterProduct().getAllCategories().toArray().forEach(function (category) {
                categoriesID.push(category.getID());
            });
        }
    });
    logger.warn('categoriesID {0}', [JSON.stringify(categoriesID)]);

    var categoriesExcluded = Site.getCurrent().getCustomPreferenceValue('categoryExclusion').trim().split(' | ');

    var haveExcludedCategoryReturn = false;

    categoriesExcluded.forEach(function (categoryExcluded) {
        if (categoriesID.includes(categoryExcluded)) {
            haveExcludedCategoryReturn = true;
        }
    });

    return haveExcludedCategoryReturn;
}

/**
 * Get the full url for a page
 * @param {string} pageName name of page for url
 * @param {string} pageTemplate template of page for url
 * @param {string} locale locale
 * @returns {string} url
 */
function getFullPageUrl(pageName, pageTemplate, locale) {
    var hostname = Site.getCurrent().getHttpsHostName();
    var siteName = Site.getCurrent().getName();

    var url = 'https://' + hostname + '/s/' + siteName + '/' + pageName + '/' + pageTemplate + '.html?lang=' + locale;

    return url;
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
    getSfccVersion: getSfccVersion,
    haveExcludedCategory: haveExcludedCategory,
    getFullPageUrl: getFullPageUrl
};
