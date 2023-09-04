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
            purchase_amount: 11700
        },
        {
            customer_fee: 0,
            purchase_amount: 11600
        },
        {
            customer_fee: 0,
            purchase_amount: 11600
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

describe('almaCheckoutHelpers', function () {
    describe('formatPlanForCheckout', function () {
        it('check in page', function () {
            setCustomPreferenceValue(true);
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plan, currencyCode);
            assert.equal(checkoutData.in_page, true);

            var planP10x = Object.assign({}, plan, {
                installments_count: 10
            });
            checkoutData = almaCheckoutHelpers.formatPlanForCheckout(planP10x, currencyCode);
            assert.equal(checkoutData.in_page, false);
        });

        it('check selector', function () {
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plan, currencyCode);
            assert.equal(checkoutData.selector, 'ALMA_general_3_0');

            var planDeferred = Object.assign({}, plan, {
                installments_count: 1,
                deferred_days: 15
            });
            checkoutData = almaCheckoutHelpers.formatPlanForCheckout(planDeferred, currencyCode);
            assert.equal(checkoutData.selector, 'ALMA_general_1_15');
        });

        it('check properties for pnx', function () {
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
                payment_installments: '117 alma.pay.in_x_installment.installments.deferred_capture  2x116'
            });
        });

        it('check properties for credit', function () {
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

        it('check properties for deffered', function () {
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

        it('check payment method PNX', function () {
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plan, currencyCode);
            assert.equal(checkoutData.payment_method, 'ALMA_PNX'
            );
        });

        it('check payment method CREDIT', function () {
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(planCredit, currencyCode);
            assert.equal(checkoutData.payment_method, 'ALMA_CREDIT');
        });

        it('check payment method DEFERRED', function () {
            var checkoutData = almaCheckoutHelpers.formatPlanForCheckout(plansDeferred, currencyCode);
            assert.equal(checkoutData.payment_method, 'ALMA_DEFERRED');
        });
    });
});
