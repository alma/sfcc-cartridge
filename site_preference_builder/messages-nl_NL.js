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
  almaRefundedAmount: { name: 'ALMA Terugbetaald bedrag' },
  almaWantedRefundAmount: { name: 'ALMA Restitutiebedrag (indien gedeeltelijk)' },
  almaRefundType: {
    name: 'Alma Restitutietype',
    description: 'Restitueer deze bestelling met de Alma module. Dit zal automatisch worden toegepast in uw alma dashboard. Het maximumbedrag dat kan worden terugbetaald is inclusief de kosten die de klant moet betalen.',
    valueDefinitions: {
      total: 'Totaal',
      partial: 'Gedeeltelijk'
    }
  },
  AlmaRefund: { name: 'Alma Refund (Refund deze bestelling met de Alma module. Dit zal automatisch worden toegepast in uw alma dashboard. Het maximale bedrag dat kan worden terugbetaald is inclusief de kosten die de klant moet betalen)' }
};
