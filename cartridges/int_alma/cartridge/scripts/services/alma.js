'use strict';

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var almaHelpers = require('*/cartridge/scripts/helpers/almaHelpers');

/**
 * Builds service for payment creating
 * @returns {dw.svc.LocalServiceRegistry} service instances
 */
function createPayment() {
    return LocalServiceRegistry.createService('alma', {
        createRequest: function (service, params) {
            service.setRequestMethod('POST');
            service.URL = almaHelpers.getUrl('/v1/payments'); // eslint-disable-line no-param-reassign
            almaHelpers.addHeaders(service);

            return JSON.stringify(params);
        },
        parseResponse: function (svc, client) {
            return client;
        }
    });
}

/**
 * Builds service for payment trigger
 * @returns {dw.svc.LocalServiceRegistry} service instances
 */
function triggerPayment() {
    return LocalServiceRegistry.createService('alma', {
        createRequest: function (service, params) {
            service.setRequestMethod('POST');
            service.URL = almaHelpers.getUrl('/v1/payments/' + params.pid + '/trigger'); // eslint-disable-line no-param-reassign
            almaHelpers.addHeaders(service);
        },
        parseResponse: function (svc, client) {
            return client;
        }
    });
}

/**
 * Builds service for getting payment details
 * @returns {dw.svc.LocalServiceRegistry} service instances
 */
function getPaymentDetails() {
    return LocalServiceRegistry.createService('alma', {
        createRequest: function (service, params) {
            service.setRequestMethod('GET');
            service.URL = almaHelpers.getUrl('/v1/payments/' + params.pid); // eslint-disable-line no-param-reassign
            almaHelpers.addHeaders(service);
        },
        parseResponse: function (svc, client) {
            return client;
        }
    });
}


/**
 * Builds service for getting eligibility. Min and Max values
 * @returns {dw.svc.LocalServiceRegistry} service instances
 */
function checkEligibility() {
    return LocalServiceRegistry.createService('alma', {
        createRequest: function (service, params) {
            service.setRequestMethod('POST');
            service.URL = almaHelpers.getUrl('/v2/payments/eligibility'); // eslint-disable-line no-param-reassign
            almaHelpers.addHeaders(service);

            return JSON.stringify(params);
        },
        parseResponse: function (svc, client) {
            return client;
        }
    });
}

/**
 * Builds service for payment refund
 * @returns {dw.svc.LocalServiceRegistry} service instances
 */
function refundPayment() {
    return LocalServiceRegistry.createService('alma', {
        createRequest: function (service, params) {
            service.setRequestMethod('POST');
            service.URL = almaHelpers.getUrl('/v1/payments/' + params.pid + '/refunds'); // eslint-disable-line no-param-reassign
            almaHelpers.addHeaders(service);

            return JSON.stringify(params);
        },
        parseResponse: function (svc, client) {
            return client;
        }
    });
}

module.exports = {
    getPaymentDetails: getPaymentDetails,
    checkEligibility: checkEligibility,
    triggerPayment: triggerPayment,
    refundPayment: refundPayment,
    createPayment: createPayment
};
