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
  almaRefundedAmount: { name: 'ALMA Erstatteter Betrag' },
  almaWantedRefundAmount: { name: 'ALMA Erstattungsbetrag (falls teilweise)' },
  almaRefundType: {
    name: 'Alma Erstattungsart',
    description: 'Erstattet diese Bestellung mit dem Alma-Modul. Dies wird automatisch in Ihrem Alma-Dashboard durchgeführt. Der maximale Betrag, der zurückerstattet werden kann, beinhaltet die Kosten, die der Kunde zu zahlen hat.',
    valueDefinitions: {
      total: 'Insgesamt',
      partial: 'Teilweise'
    }
  },
  AlmaRefund: { name: 'Alma Refund (Erstattet diese Bestellung mit dem Alma-Modul. Dies wird automatisch in Ihrem Alma Dashboard durchgeführt. Der maximale Betrag, der zurückerstattet werden kann, beinhaltet die Kosten, die der Kunde zu zahlen hat)' }
};
