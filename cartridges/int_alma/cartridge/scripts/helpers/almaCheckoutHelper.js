'use strict';

var Resource = require('dw/web/Resource');
var formatCurrency = require('*/cartridge/scripts/util/formatting').formatCurrency;
var isOnShipmentPaymentEnabled = require('*/cartridge/scripts/helpers/almaOnShipmentHelper').isOnShipmentPaymentEnabled;

/**
 * Build the selectorName used in isml
 * @param  {Object} plan any alma plan
 * @returns {string} the custom site preference name
 */
function getSelectorNameFromPlan(plan) {
    return 'alma_general_'
        // number of installments (p1x, p3x, p4x, ....)
        + plan.installments_count + '_'
        // by how many days is the payment defered
        + plan.deferred_days
    ;
}

/**
 * Fetch the appropriate property category for a given plan
 * @param  {Object} plan any alma plan
 * @returns {string} the property 'namespace'
 */
function getPropertyCategory(plan) {
    if (plan.installments_count > 1 && plan.deferred_days > 0) {
        return 'alma.pay.in_x_installment_after_x_days';
    }
    if (plan.deferred_days > 0) {
        return 'alma.pay.after_x_days';
    }
    return 'alma.pay.in_x_installment';
}

/**
 * Returns the title, image and description properties for a given plan
 * @param  {Object} plan any alma plan
 * @returns {Object} with the properties translated
 */
function getPaymentCoreInfo(plan) {
    var propertyParam = plan.installments_count;
    if (plan.deferred_days > 0) {
        propertyParam = plan.deferred_days;
    }
    return {
        title: Resource.msgf(getPropertyCategory(plan), 'alma', null, propertyParam),
        img: Resource.msgf(getPropertyCategory(plan) + '.img', 'alma', null, propertyParam),
        description: Resource.msgf(getPropertyCategory(plan) + '.description', 'alma', null, propertyParam)
    };
}

/**
 * Returns the amount and rate of a credit properties for a given plan
 * @param  {Object} plan any alma plan
 * @param  {string} currencyCode e.g. 'EUR'
 * @returns {Object} with the properties translated
 */
function getCreditInfo(plan, currencyCode) {
    var costOfCredit = formatCurrency(plan.customer_total_cost_amount / 100, currencyCode);
    var purchaseAmount = formatCurrency(plan.purchaseAmount, currencyCode);
    var totalCost = formatCurrency(plan.purchaseAmount + (plan.customer_total_cost_amount / 100), currencyCode);
    var rate = Math.round(plan.annual_interest_rate / 100).toString() + '.' + (plan.annual_interest_rate % 100) + '%';
    return {
        basket_cost: Resource.msgf('alma.credit.basket_cost', 'alma', null, purchaseAmount),
        amount: Resource.msgf('alma.credit.cost_of_credit', 'alma', null, costOfCredit),
        rate: Resource.msgf('alma.credit.fixed_apr', 'alma', null, rate),
        total_cost: Resource.msgf('alma.credit.total_cost', 'alma', null, totalCost)
    };
}

/**
 * Returns the payment fees for a given plan
 * @param  {Object} plan any alma plan
 * @param  {string} currencyCode e.g. 'EUR'
 * @returns {string} the message to display fees
 */
function getPaymentFees(plan, currencyCode) {
    return plan.payment_plan[0].customer_fee > 0 ?
        Resource.msgf('alma.with_fee', 'alma', null, formatCurrency(plan.payment_plan[0].customer_fee / 100, currencyCode)) :
        Resource.msg('alma.not_fee', 'alma', null);
}

/**
 * Returns the string needed to explain remaining installments after the first one
 * @param  {Object} plan any alma plan
 * @returns {string} containing the remaining installment to pay after the 1st one
 */
function getInstallmentCountAfterFirst(plan) {
    if (plan.installments_count > 2) {
        return ' ' + (plan.installments_count - 1) + 'x';
    }
    return '';
}

/**
 * Returns the property displaying installments before calling fragment
 * @param  {Object} plan any alma plan
 * @param  {string} currencyCode e.g. 'EUR'
 * @returns {string} the message to display for a payment option
 */
function getPaymentInstallments(plan, currencyCode) {
    // deferred payment
    if (plan.deferred_days > 0) {
        return Resource.msgf(getPropertyCategory(plan) + '.installments', 'alma', null,
            formatCurrency(plan.payment_plan[0].purchase_amount / 100, currencyCode),
            plan.deferred_days
        );
    }
    // onshipment payment
    if (isOnShipmentPaymentEnabled(plan.installments_count)) {
        return formatCurrency(plan.payment_plan[0].purchase_amount / 100, currencyCode) + ' ' +
            Resource.msg(getPropertyCategory(plan) + '.installments.onshipment', 'alma', null) + ' ' +
            getInstallmentCountAfterFirst(plan) +
            formatCurrency(plan.payment_plan[1].purchase_amount / 100, currencyCode)
        ;
    }
    // installment payment
    return formatCurrency(plan.payment_plan[0].purchase_amount / 100, currencyCode) + ' ' +
        Resource.msg(getPropertyCategory(plan) + '.installments', 'alma', null) + ' ' +
        getInstallmentCountAfterFirst(plan) +
        formatCurrency(plan.payment_plan[1].purchase_amount / 100, currencyCode)
    ;
}

/**
 * Returns All the properties needed by Checkout controller
 * @param  {Object} plan any alma plan
 * @param  {string} currencyCode e.g. 'EUR'
 * @returns {Object} with all the properties needed by frontend
 */
function getPropertiesForPlan(plan, currencyCode) {
    return Object.assign(
        getPaymentCoreInfo(plan),
        {
            fees: getPaymentFees(plan, currencyCode),
            credit: getCreditInfo(plan, currencyCode),
            payment_installments: getPaymentInstallments(plan, currencyCode)
        }
    );
}

/**
 * Returns if the current payment option is pnx 2,3 or 4
 * @param  {Object} plan any alma plan
 * @returns {boolean} true means we can use fragment
 */
function isPnx(plan) {
    return plan.installments_count <= 4;
}

/**
 * Returns true if the merchant want in-page payment
 * @returns {bool} if we can use fragment
 */
function isFragmentActivated() {
    var Site = require('dw/system/Site');

    return Site.getCurrent().getCustomPreferenceValue('ALMA_Fragment_Payment');
}

/**
 * Format plan data to fit in Checkout view data
 * @param  {Object} plan any alma plan
 * @param  {string} currencyCode e.g. 'EUR'
 * @returns {array} a plan Object understandable for Eligibility
 */
function formatPlanForCheckout(plan, currencyCode) {
    return {
        in_page: isPnx(plan) && isFragmentActivated(),
        selector: getSelectorNameFromPlan(plan),
        installments_count: plan.installments_count,
        deferred_days: plan.deferred_days,
        purchase_amount: plan.purchase_amount,
        customer_fee: plan.customer_fee,
        payment_plan: plan.payment_plan,
        properties: getPropertiesForPlan(plan, currencyCode)
    };
}

module.exports = {
    formatForCheckout: formatPlanForCheckout
};
