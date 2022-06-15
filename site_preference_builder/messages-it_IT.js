/* eslint-disable max-len */
exports.messages = {
  x_times_payment: {
    title: 'Activate or deactivate [[installments]]x installment payment',
    min: 'Importo minimo dell\'ordine per consentire il pagamento in [[installments]] rate',
    min_disclamer: 'N.B. il minimo consentito è di [[amount]] (contatta il tuo venditore Alma se vuoi cambiarlo)',
    max: 'Importo massimo dell\'ordine per consentire il pagamento in [[installments]] rate',
    max_disclamer: 'N.B. il massimo consentito è di [[amount]] (contatta il tuo venditore Alma se vuoi cambiarlo)',
    group: 'Alma [[installments]]x'
  },
  deferred_payment: {
    title: 'Activate or deactivate payment @ +[[deferredDays]] days',
    min: 'Importo minimo dell\'ordine per consentire il pagamento differito a [[deferredDays]] giorni',
    min_disclamer: 'N.B. il minimo consentito è di [[amount]] (contatta il tuo venditore Alma se vuoi cambiarlo)',
    max: 'Importo massimo dell\'ordine per consentire il pagamento differito a [[deferredDays]] giorni',
    max_disclamer: 'N.B. il massimo consentito è di [[amount]] (contatta il tuo venditore Alma se vuoi cambiarlo)',
    group: 'Alma G+[[deferredDays]]'
  },
  x_times_deferred_payment: {
    title: 'Activate or deactivate [[installments]]x installment payment @ +[[deferredDays]] days',
    min: 'Ordine minimo consentito per il pagamento in [[installments]] rate e differito a [[deferredDays]] giorni',
    min_disclamer: 'N.B. il minimo consentito è di [[amount]] (contatta il tuo venditore Alma se vuoi cambiarlo)',
    max: 'Ordine massimo consentito per il pagamento in [[installments]] rate e differito a [[deferredDays]] giorni',
    max_disclamer: 'N.B. il massimo consentito è di [[amount]] (contatta il tuo venditore Alma se vuoi cambiarlo)',
    group: 'Alma [[installments]]x @ G+[[deferredDays]]'
  }
};
