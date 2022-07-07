/* eslint-disable max-len */
exports.messages = {
  x_times_payment: {
    title: 'Activate or deactivate [[installments]]x installment payment',
    min: 'Min orderbedrag om [[installments]]x termijnbetaling toe te staan',
    min_disclamer: 'N.B. u kunt niet lager gaan dan [[amount]] (neem contact op met uw Alma-verkoper als u dit wilt veranderen)',
    max: 'Max orderbedrag om [[installments]]x termijnbetaling toe te staan',
    max_disclamer: 'N.B. u kunt niet hoger gaan dan [[amount]] (neem contact op met uw Alma-verkoper als u dit wilt veranderen)',
    group: 'Alma [[installments]]x'
  },
  deferred_payment: {
    title: 'Activate or deactivate payment @ +[[deferredDays]] days',
    min: 'Min orderbedrag om betaling toe te staan @ +[[deferredDays]] dagen',
    min_disclamer: 'N.B. u kunt niet lager gaan dan [[amount]] (neem contact op met uw Alma-verkoper als u dit wilt veranderen)',
    max: 'Max orderbedrag om betaling @ +[[deferredDays]] dagen toe te staan',
    max_disclamer: 'N.B. u kunt niet hoger gaan dan [[amount]] (neem contact op met uw Alma-verkoper als u dit wilt veranderen)',
    group: 'Alma D+[[deferredDays]]'
  },
  x_times_deferred_payment: {
    title: 'Activate or deactivate [[installments]]x installment payment @ +[[deferredDays]] days',
    min: 'Min. orderbedrag voor [[installments]]x betaling in termijnen @ +[[deferredDays]] dagen',
    min_disclamer: 'N.B. u kunt niet lager gaan dan [[amount]] (neem contact op met uw Alma-verkoper als u dit wilt veranderen)',
    max: 'Max orderbedrag voor [[installments]]x betaling in termijnen @ +[[deferredDays]] dagen',
    max_disclamer: 'N.B. u kunt niet hoger gaan dan [[amount]] (neem contact op met uw Alma-verkoper als u dit wilt veranderen)',
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
