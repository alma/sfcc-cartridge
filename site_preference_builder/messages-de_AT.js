/* eslint-disable max-len */
exports.messages = {
  x_times_payment: {
    title: 'Activate or deactivate [[installments]]x installment payment',
    min: 'Min order amount to allow [[installments]]x installment payment',
    min_disclamer: 'N.B. you can\'t go lower than [[amount]] (please contact your Alma Salesperson if you want to change it)',
    max: 'Max order amount to allow [[installments]]x installment payment',
    max_disclamer: 'N.B. you can\'t go higher than [[amount]] (please contact your Alma Salesperson if you want to change it)',
    group: 'Alma [[installments]]x'
  },
  deferred_payment: {
    title: 'Activate or deactivate payment @ +[[deferredDays]] days',
    min: 'Min order amount to allow payment @ +[[deferredDays]] days',
    min_disclamer: 'N.B. you can\'t go lower than [[amount]] (please contact your Alma Salesperson if you want to change it)',
    max: 'Max order amount to allow payment @ +[[deferredDays]] days',
    max_disclamer: 'N.B. you can\'t go higher than [[amount]] (please contact your Alma Salesperson if you want to change it)',
    group: 'Alma D+[[deferredDays]]'
  },
  x_times_deferred_payment: {
    title: 'Activate or deactivate [[installments]]x installment payment @ +[[deferredDays]] days',
    min: 'Min order amount to allow [[installments]]x installment payment @ +[[deferredDays]] days',
    min_disclamer: 'N.B. you can\'t go lower than [[amount]] (please contact your Alma Salesperson if you want to change it)',
    max: 'Max order amount to allow [[installments]]x installment payment @ +[[deferredDays]] days',
    max_disclamer: 'N.B. you can\'t go higher than [[amount]] (please contact your Alma Salesperson if you want to change it)',
    group: 'Alma [[installments]]x @ D+[[deferredDays]]'
  },
  almaRefundedAmount: {
    name: 'ALMA Refunded Amount'
  },
  almaWantedRefundAmount: {
    name: 'ALMA Refund Amount (if partial)'
  },
  almaRefundType: {
    name: 'Alma Refund Type',
    description: 'Refund this order with the Alma module. This will be applied in your alma dashboard automatically. The maximum amount that can be refunded includes the costs that the customer has to pay.',
    valueDefinitions: {
      total: 'Total',
      partial: 'Partial'
    }
  },
  AlmaRefund: {
    name: 'Alma Refund (Refund this order with the Alma module. This will be applied in your alma dashboard automatically. The maximum amount that can be refunded includes the costs that the customer has to pay)'
  }
};
