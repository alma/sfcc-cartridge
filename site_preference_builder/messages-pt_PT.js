/* eslint-disable max-len */
exports.messages = {
  x_times_payment: {
    title: 'Permitir o pagamento em [[installments]] prestações',
    min: 'Montante mínimo da encomenda para permitir o pagamento em [[installments]] prestações',
    min_disclamer: 'N.B. não pode ser inferior a [[amount]] (por favor, entre em contato com o seu Vendedor Alma se quiser alterá-lo)',
    max: 'Montante máximo da encomenda para permitir o pagamento em [[installments]] prestações',
    max_disclamer: 'N.B. não pode ser superior a [[amount]] (por favor, entre em contato com o seu Vendedor Alma se quiser alterá-lo)',
    group: 'Alma [[installments]]x'
  },
  deferred_payment: {
    title: 'Permitir o pagamento @ +[[deferredDays]] dias',
    min: 'Montante mínimo da encomenda para permitir o pagamento @ +[[deferredDays]] dias',
    min_disclamer: 'N.B. não pode ser inferior a [[amount]] (por favor, entre em contato com o seu Vendedor Alma se quiser alterá-lo)',
    max: 'Montante máximo da encomenda para permitir o pagamento @ +[[deferredDays]] dias',
    max_disclamer: 'N.B. não pode superior a [[amount]] (por favor, entre em contato com o seu Vendedor Alma se quiser alterá-lo)',
    group: 'Alma D+[[deferredDays]]'
  },
  x_times_deferred_payment: {
    title: 'Permitir o pagamento em [[installments]] prestações @ +[[deferredDays]] dias',
    min: 'Montante mínimo da encomenda para permitir o pagamento em [[installments]] prestações @ +[[deferredDays]] dias',
    min_disclamer: 'N.B. não pode ser inferior a [[amount]] (por favor, entre em contato com o seu Vendedor Alma se quiser alterá-lo)',
    max: 'Montante máximo da encomenda para permitir o pagamento em [[installments]] prestações @ +[[deferredDays]] dias',
    max_disclamer: 'N.B. não pode ser superior a [[amount]] (por favor, entre em contato com o seu Vendedor Alma se quiser alterá-lo)',
    group: 'Alma [[installments]]x @ D+[[deferredDays]]'
  }
};
