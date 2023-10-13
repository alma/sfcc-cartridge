// checkoutHelpers.js unit tests

var assert = require('chai').assert;

var almaCheckoutHelpers = require('../../../../mocks/helpers/almaCheckoutHelpers').almaCheckoutHelpers;
var setCustomPreferenceValue = require('../../../../mocks/helpers/almaCheckoutHelpers').setCustomPreferenceValue;
var setIsAvailableForManualCapture = require('../../../../mocks/helpers/almaCheckoutHelpers').setIsAvailableForManualCapture;

var plan = {
    installments_count: 3,
    deferred_days: 0,
    purchase_amount: 35000,
    customer_fee: 0,
    payment_plan: [
        {
            customer_fee: 0,
            purchase_amount: 11700,
            localized_due_date: 'Order processing'
        },
        {
            customer_fee: 0,
            purchase_amount: 11600,
            localized_due_date: '1 months later'
        },
        {
            customer_fee: 0,
            purchase_amount: 11600,
            localized_due_date: '2 months later'
        }
    ]
};

var planCredit = {
    installments_count: 6,
    deferred_days: 0,
    purchase_amount: 36000,
    customer_fee: 0,
    payment_plan: [
        {
            customer_fee: 0,
            purchase_amount: 6000
        },
        {
            customer_fee: 0,
            purchase_amount: 6000
        },
        {
            customer_fee: 0,
            purchase_amount: 6000
        },
        {
            customer_fee: 0,
            purchase_amount: 6000
        },
        {
            customer_fee: 0,
            purchase_amount: 6000
        },
        {
            customer_fee: 0,
            purchase_amount: 6000
        }
    ]
};

var plansDeferred = {
    installments_count: 1,
    deferred_days: 15,
    purchase_amount: 35000,
    customer_fee: 0,
    payment_plan: [
        {
            customer_fee: 0,
            purchase_amount: 35000
        }
    ]
};
var currencyCode = 'EUR';

describe('AlmaCheckoutHelpers', function () {
    describe('FormatPlanForCheckout', function () {
        it('Check value of the fields in_page depending of payment method', function () {
            setCustomPreferenceValue(true);
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plan, currencyCode);
            assert.equal(checkoutData.in_page, true);

            var planP10x = Object.assign({}, plan, {
                installments_count: 10
            });
            checkoutData = almaCheckoutHelpers.formatPlanForCheckout(planP10x, currencyCode);
            assert.equal(checkoutData.in_page, false);
        });

        it('Check field selector depending of the plan', function () {
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plan, currencyCode);
            assert.equal(checkoutData.selector, 'ALMA_general_3_0');

            var planDeferred = Object.assign({}, plan, {
                installments_count: 1,
                deferred_days: 15
            });
            checkoutData = almaCheckoutHelpers.formatPlanForCheckout(planDeferred, currencyCode);
            assert.equal(checkoutData.selector, 'ALMA_general_1_15');
        });

        it('Properties for pnx is well formed', function () {
            setIsAvailableForManualCapture(true);
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plan, currencyCode);
            assert.deepEqual(checkoutData.properties, {
                title: 'alma.pay.in_x_installment',
                img: 'alma.pay.in_x_installment.img',
                description: 'alma.pay.in_x_installment.description',
                fees: 'alma.not_fee',
                credit: {
                    amount: 'alma.credit.cost_of_credit',
                    rate: 'alma.credit.fixed_apr',
                    basket_cost: 'alma.credit.basket_cost',
                    total_cost: 'alma.credit.total_cost'
                },
                payment_installments: '117 Order processingalma.pay.in_x_installment.installments.then  2x116'
            });
        });

        it('Properties for credit is well formed', function () {
            setIsAvailableForManualCapture(false);
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(planCredit, currencyCode);
            assert.deepEqual(checkoutData.properties, {
                title: 'alma.pay.in_x_installment',
                img: 'alma.pay.in_x_installment.img',
                description: 'alma.pay.in_x_installment.description',
                fees: 'alma.not_fee',
                credit: {
                    amount: 'alma.credit.cost_of_credit',
                    rate: 'alma.credit.fixed_apr',
                    basket_cost: 'alma.credit.basket_cost',
                    total_cost: 'alma.credit.total_cost'
                },
                payment_installments: '60 alma.pay.in_x_installment.installments  5x60'
            });
        });

        it('Properties for deferred is well formed', function () {
            setIsAvailableForManualCapture(false);
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plansDeferred, currencyCode);
            assert.deepEqual(checkoutData.properties, {
                title: 'alma.pay.after_x_days',
                img: 'alma.pay.after_x_days.img',
                description: 'alma.pay.after_x_days.description',
                fees: 'alma.not_fee',
                credit: {
                    amount: 'alma.credit.cost_of_credit',
                    rate: 'alma.credit.fixed_apr',
                    basket_cost: 'alma.credit.basket_cost',
                    total_cost: 'alma.credit.total_cost'
                },
                payment_installments: 'alma.pay.after_x_days.installments'
            });
        });

        it('Check payment method for PNX', function () {
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plan, currencyCode);
            assert.equal(checkoutData.payment_method, 'ALMA_PNX'
            );
        });

        it('check payment method for CREDIT', function () {
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(planCredit, currencyCode);
            assert.equal(checkoutData.payment_method, 'ALMA_CREDIT');
        });

        it('Check payment method for DEFERRED', function () {
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plansDeferred, currencyCode);
            assert.equal(checkoutData.payment_method, 'ALMA_DEFERRED');
        });
    });
});
