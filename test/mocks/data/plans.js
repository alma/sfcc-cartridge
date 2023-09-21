'use strict';

var plansForCheckout = {
    ALMA_PAY_NOW: {
        ALMA_general_1_0: {
            installments_count: 1,
            deferred_days: 0,
            payment_plans: [
                {
                    due_date: 1696596910,
                    purchase_amount: 30000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: 'Order processing',
                    time_delta_from_start: null
                }
            ]
        }
    },
    ALMA_DEFERRED: {
        ALMA_general_1_15: {
            installments_count: 1,
            deferred_days: 15,
            payment_plans: [
                {
                    due_date: 1696596910,
                    purchase_amount: 30000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: 'Order processing',
                    time_delta_from_start: null
                }
            ]
        }
    },
    ALMA_PNX: {
        ALMA_general_2_0: {
            installments_count: 2,
            deferred_days: 0,
            payment_plans: [
                {
                    due_date: 1695300910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: 'Order processing',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '1 months later',
                    time_delta_from_start: null
                }
            ]
        },
        ALMA_general_3_0: {
            installments_count: 3,
            deferred_days: 0,
            payment_plans: [
                {
                    due_date: 1695300910,
                    purchase_amount: 10000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: 'Order processing',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 10000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '1 months later',
                    time_delta_from_start: null
                },
                {
                    due_date: 1700571310,
                    purchase_amount: 10000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '2 months later',
                    time_delta_from_start: null
                }
            ]
        }
    },
    ALMA_CREDIT: {
        ALMA_general_10_0: {
            installments_count: 10,
            deferred_days: 0,
            payment_plans: [
                {
                    due_date: 1695300910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: 'Order processing',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '1 months later',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '2 months later',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '3 months later',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '4 months later',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '5 months later',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '6 months later',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '7 months later',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '8 months later',
                    time_delta_from_start: null
                },
                {
                    due_date: 1697892910,
                    purchase_amount: 15000,
                    customer_fee: 0,
                    customer_interest: 0,
                    total_amount: 30000,
                    localized_due_date: '9 months later',
                    time_delta_from_start: null
                }
            ]
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
                payment_plans: [
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1696596910,
                        localized_due_date: 'Order processing',
                        purchase_amount: 30000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    }
                ],
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
                captureMethod: 'automatic',
                payment_plans: [
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1696596910,
                        localized_due_date: 'Order processing',
                        purchase_amount: 30000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    }
                ],
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
                captureMethod: 'automatic',
                payment_plans: [
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1695300910,
                        localized_due_date: 'Order processing',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '1 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    }
                ],
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
                captureMethod: 'automatic',
                payment_plans: [
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1695300910,
                        localized_due_date: 'Order processing',
                        purchase_amount: 10000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '1 months later',
                        purchase_amount: 10000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1700571310,
                        localized_due_date: '2 months later',
                        purchase_amount: 10000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    }
                ],
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
                captureMethod: 'automatic',
                payment_plans: [
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1695300910,
                        localized_due_date: 'Order processing',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '1 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '2 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '3 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '4 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '5 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '6 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '7 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '8 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    },
                    {
                        customer_fee: 0,
                        customer_interest: 0,
                        due_date: 1697892910,
                        localized_due_date: '9 months later',
                        purchase_amount: 15000,
                        time_delta_from_start: null,
                        total_amount: 30000
                    }
                ],
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
