const sinon = require('sinon');

function mockPlanFactory(count) {
    var plans = [];
    // TODO: Muting no-plusplus rule until we refactor more efficiently the code to match Node >=22
    // eslint-disable-next-line no-plusplus
    for (var i = 0; i < count; i++) {
        var localizedDueDate = i + ' months later';
        if (i === 0) {
            localizedDueDate = 'Order processing';
        }
        var plan = {
            due_date: 1695300910,
            purchase_amount: 15000,
            customer_fee: 0,
            customer_interest: 0,
            total_amount: 30000,
            localized_due_date: localizedDueDate,
            time_delta_from_start: null
        };
        plans.push(plan);
    }
    return plans;
}

var plansForCheckout = {
    ALMA_PAY_NOW: {
        ALMA_general_1_0: {
            installments_count: 1,
            deferred_days: 0,
            payment_plans: mockPlanFactory(1)
        }
    },
    ALMA_DEFERRED: {
        ALMA_general_1_15: {
            installments_count: 1,
            deferred_days: 15,
            payment_plans: mockPlanFactory(1)
        }
    },
    ALMA_PNX: {
        ALMA_general_2_0: {
            installments_count: 2,
            deferred_days: 0,
            payment_plans: mockPlanFactory(2)
        },
        ALMA_general_3_0: {
            installments_count: 3,
            deferred_days: 0,
            payment_plans: mockPlanFactory(3)
        }
    },
    ALMA_CREDIT: {
        ALMA_general_10_0: {
            installments_count: 10,
            deferred_days: 0,
            payment_plans: mockPlanFactory(10)
        }
    }
};

var formattedPlansForCheckoutExpected = [
    {
        hasEligiblePaymentMethod: true,
        name: 'ALMA_PAY_NOW',
        plans: [
            {
                installments_count: 1,
                deferred_days: 0,
                captureMethod: 'automatic',
                payment_plans: mockPlanFactory(1),
                properties: {
                    credit: {
                        amount: '',
                        basket_cost: '',
                        rate: '',
                        total_cost: ''
                    },
                    description: '',
                    fees: '',
                    img: '',
                    title: ''
                }
            }
        ]
    },
    {
        hasEligiblePaymentMethod: true,
        name: 'ALMA_DEFERRED',
        plans: [
            {
                installments_count: 1,
                deferred_days: 15,
                payment_plans: mockPlanFactory(1),
                captureMethod: 'automatic',
                properties: {
                    credit: {
                        amount: '',
                        basket_cost: '',
                        rate: '',
                        total_cost: ''
                    },
                    description: '',
                    fees: '',
                    img: '',
                    title: ''
                }
            }
        ]
    },
    {
        hasEligiblePaymentMethod: true,
        name: 'ALMA_PNX',
        plans: [
            {
                installments_count: 2,
                deferred_days: 0,
                payment_plans: mockPlanFactory(2),
                captureMethod: 'automatic',
                properties: {
                    credit: {
                        amount: '',
                        basket_cost: '',
                        rate: '',
                        total_cost: ''
                    },
                    description: '',
                    fees: '',
                    img: '',
                    title: ''
                }
            },
            {
                installments_count: 3,
                deferred_days: 0,
                payment_plans: mockPlanFactory(3),
                captureMethod: 'automatic',
                properties: {
                    credit: {
                        amount: '',
                        basket_cost: '',
                        rate: '',
                        total_cost: ''
                    },
                    description: '',
                    fees: '',
                    img: '',
                    title: ''
                }
            }
        ]
    },
    {
        hasEligiblePaymentMethod: true,
        name: 'ALMA_CREDIT',
        plans: [
            {
                installments_count: 10,
                deferred_days: 0,
                payment_plans: mockPlanFactory(10),
                captureMethod: 'automatic',
                properties: {
                    credit: {
                        amount: '',
                        basket_cost: '',
                        rate: '',
                        total_cost: ''
                    },
                    description: '',
                    fees: '',
                    img: '',
                    title: ''
                }
            }
        ]
    }
];

module.exports = {
    plansForCheckout: plansForCheckout,
    formattedPlansForCheckoutExpected: formattedPlansForCheckoutExpected
};
