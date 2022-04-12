// checkoutHelpers.js unit tests

var assert = require('chai').assert;

var almaCheckoutHelpers = require('../../../../mocks/helpers/almaCheckoutHelpers');

describe('almaCheckoutHelpers', function () {
    describe('formatPlanForCheckout', function () {
        it('should return true', function () {
            var plan = {
                installments_count: 3,
                deferred_days: 0,
                purchase_amount: 35000,
                customer_fee: 0,
                payment_plan: [
                    {
                        customer_fee: 0
                    },
                    {
                        customer_fee: 0
                    }
                ]
            };
            var currencyCode = 'EUR';

            var checkoutData = almaCheckoutHelpers.formatForCheckout(plan, currencyCode);
            assert.equal(checkoutData.in_page, true);
        });
    });
});
