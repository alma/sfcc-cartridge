'use strict';

var Site = require('dw/system/Site');
var logger = require('dw/system/Logger').getLogger('alma');
var almaUtilsHelpers = require('*/cartridge/scripts/helpers/almaUtilsHelper');
var almaEligibilityHelper = require('*/cartridge/scripts/helpers/almaEligibilityHelper');
var almaCheckoutHelper = require('*/cartridge/scripts/helpers/almaCheckoutHelper');
var almaWidgetHelper = require('*/cartridge/scripts/helpers/almaWidgetHelper');

/**
 * Calls /me/fee-plans and fetch the available plans for the current merchant
 * @returns {array} plans
 */
function getFeePlans() {
    var plansString = Site.getCurrent().getCustomPreferenceValue('ALMA_FEE_PLANS');
    try {
        return JSON.parse(plansString);
    } catch (e) {
        logger.error('Configuration Error, please run \'npm run build:sitepref\' and import site_template.zip again.');
    }
    return [];
}

/**
 * build the appropriate custom site pref name for a given plan
 * @param  {Object} plan any alma plan
 * @returns {string} site preference name
 */
function getSitePrefNameFromPlan(plan) {
    return 'ALMA_general_'
        // number of installments (p1x, p3x, p4x, ....)
        + plan.installments_count + '_'
        // by how many days is the payment defered
        + plan.deferred_days
    ;
}

/**
 * Check if plan is activated by the merchant in sfcc back office
 * @param  {Object} plan any alma plan
 * @returns {boolean} true or false
 */
function checkMerchantConfig(plan) {
    var sitePref = Site.getCurrent().getCustomPreferenceValue(getSitePrefNameFromPlan(plan));
    return sitePref === true || sitePref === null;
}

/**
 * Restrict min and max amount trigger for a plan upon merchant settings sfcc back office
 * Leave Alma's setting if setting is blank
 * @param  {Object} currentPlan any alma plan
 * @returns {Object} plan any alma plan
 */
function applyMerchantConfig(currentPlan) {
    var plan = currentPlan;
    var sitePrefBase = getSitePrefNameFromPlan(plan);

    var minSitePref = Site.getCurrent().getCustomPreferenceValue(sitePrefBase + '_min');
    if (minSitePref !== null) {
        // * 100 because price is in cents
        plan.min_purchase_amount = minSitePref * 100;
    }

    var maxSitePref = Site.getCurrent().getCustomPreferenceValue(sitePrefBase + '_max');
    if (maxSitePref !== null) {
        // * 100 because price is in cents
        plan.max_purchase_amount = maxSitePref * 100;
    }

    return plan;
}

/**
 * Before calling eligibility, remove plans that doesn't fall within merchant config
 * @param  {Object} plan any alma plan
 * @param  {number} purchaseAmount order total amount
 * @returns {Object} plan any alma plan
 */
function filterWithMerchantConfig(plan, purchaseAmount) {
    var sitePrefBase = getSitePrefNameFromPlan(plan);
    var minSitePref = Site.getCurrent().getCustomPreferenceValue(sitePrefBase + '_min');
    var maxSitePref = Site.getCurrent().getCustomPreferenceValue(sitePrefBase + '_max');

    return (minSitePref === null || purchaseAmount > minSitePref)
            && (maxSitePref === null || purchaseAmount < maxSitePref);
}

/**
 * Get data to intialize widget in cart and product detail
 * @returns {array} widget data
 */
function getAllowedPlans() {
    var plans = getFeePlans();
    // only keep what's alma allows
    plans = almaUtilsHelpers.filter(plans, function (plan) {
        return plan.allowed;
    });
    // only keep what's the merchant allow
    plans = almaUtilsHelpers.filter(plans, checkMerchantConfig);

    return almaUtilsHelpers.map(plans, applyMerchantConfig);
}

/**
 * Get data to intialize widget in cart and product detail
 * @returns {array} eligible data
 */
function getPlansForWidget() {
    var plans = getAllowedPlans();

    plans = almaUtilsHelpers.map(plans, almaWidgetHelper.formatForAlmaWidget);

    return plans;
}

/**
 * Get data to intialize widget in cart and product detail
 * @param {string} locale e.g. "fr_FR"
 * @param {dw.order.Basket} currentBasket current basket
 * @returns {array} eligible data
 */
function getPlansForCheckout(locale, currentBasket) {
    var plansForEligibility = getAllowedPlans();
    var purchaseAmount = currentBasket.totalGrossPrice.value;

    plansForEligibility = almaUtilsHelpers.filter(plansForEligibility, function (plan) {
        return filterWithMerchantConfig(plan, purchaseAmount);
    });

    var plans = almaEligibilityHelper.getEligibility(plansForEligibility, locale, currentBasket);

 // remove non eligible plan ?
    plans = almaUtilsHelpers.filter(plans, function (plan) {
        return plan.eligible === true && !(plan.deferred_days === 0 && plan.installments_count === 1);
    });

    plans = almaUtilsHelpers.map(plans, function (plan) {
        plan.purchaseAmount = purchaseAmount; // eslint-disable-line no-param-reassign
        return almaCheckoutHelper.formatForCheckout(plan, currentBasket.currencyCode);
    });

    return plans;
}

module.exports = {
    getAllowedPlans: getAllowedPlans,
    getPlansForWidget: getPlansForWidget,
    getPlansForCheckout: getPlansForCheckout
};
