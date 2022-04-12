// checkoutHelpers.js unit tests

var assert = require('chai').assert;

var almaCheckoutHelpers = require('../../../../mocks/helpers/almaCheckoutHelpers');

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
var currencyCode = 'EUR';

describe('almaCheckoutHelpers', function () {
    describe('formatPlanForCheckout', function () {
        it('check in page', function () {
            var checkoutData = almaCheckoutHelpers.formatForCheckout(plan, currencyCode);
            assert.equal(checkoutData.in_page, true);

            var planP10x = Object.assign({}, plan, {
                installments_count: 10
            });
            checkoutData = almaCheckoutHelpers.formatForCheckout(planP10x, currencyCode);
            assert.equal(checkoutData.in_page, false);
        });

        it('check selector', function () {
            var checkoutData = almaCheckoutHelpers.formatForCheckout(plan, currencyCode);
            assert.equal(checkoutData.selector, 'alma_general_3_0');

            var planDeferred = Object.assign({}, plan, {
                installments_count: 1,
                deferred_days: 15
            });
            checkoutData = almaCheckoutHelpers.formatForCheckout(planDeferred, currencyCode);
            assert.equal(checkoutData.selector, 'alma_general_1_15');
        });

        it('check properties', function () {
            var checkoutData = almaCheckoutHelpers.formatForCheckout(plan, currencyCode);
            assert.deepEqual(checkoutData.properties, {
                title: 'alma.pay.in_x_installment',
                img: 'alma.pay.in_x_installment.img',
                description: 'alma.pay.in_x_installment.description',
                fees: 'alma.not_fee',
                credit: { amount: 'alma.credit.cost_of_credit', rate: 'alma.credit.fixed_apr' },
                payment_installments: '117 alma.pay.in_x_installment.installments  2x116'
            });
        });
    });
});
