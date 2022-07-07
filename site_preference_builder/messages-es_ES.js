/* eslint-disable max-len */
exports.messages = {
  x_times_payment: {
    title: 'Habilitar [[installments]]x pago a plazos',
    min: 'Importe mínimo del pedido para permitir [[installments]]x pago a plazos',
    min_disclamer: 'No se puede introducir una cantidad inferior a [[amount]] (por favor, ponte en contacto con tu vendedor de Alma si quieres cambiarlo)',
    max: 'Importe máximo del pedido para permitir [[installments]]x pago a plazos',
    max_disclamer: 'No se puede introducir una cantidad superior a [[amount]] (por favor, ponte en contacto con tu vendedor de Alma si quieres cambiarlo)',
    group: 'Alma [[installments]]x'
  },
  deferred_payment: {
    title: 'Habilitar el pago @ [[deferredDays]] días',
    min: 'Importe mínimo del pedido para permitir el pago @ [[deferredDays]] días',
    min_disclamer: 'No se puede introducir una cantidad inferior a [[amount]] (por favor, ponte en contacto con tu vendedor de Alma si quieres cambiarlo)',
    max: 'Importe máximo del pedido para permitir el pago @ [[deferredDays]] días',
    max_disclamer: 'No se puede introducir una cantidad superior a [[amount]] (por favor, ponte en contacto con tu vendedor de Alma si quieres cambiarlo)',
    group: 'Alma D+[[deferredDays]]'
  },
  x_times_deferred_payment: {
    title: 'Habilitar [[installments]]x pago a plazos @ [[deferredDays]] días',
    min: 'Importe mínimo del pedido para permitir [[installments]]x pago a plazos @ [[deferredDays]] días',
    min_disclamer: 'No se puede introducir una cantidad inferior a [[amount]] (por favor, ponte en contacto con tu vendedor de Alma si quieres cambiarlo)',
    max: 'Importe máximo del pedido para permitir [[installments]]x pago a plazos @ [[deferredDays]] días',
    max_disclamer: 'No se puede introducir una cantidad superior a [[amount]] (por favor, ponte en contacto con tu vendedor de Alma si quieres cambiarlo)',
    group: 'Alma [[installments]]x @ D [[deferredDays]]'
  },
  almaRefundedAmount: { name: 'ALMA Importe reembolsado' },
  almaWantedRefundAmount: { name: 'Importe del reembolso ALMA (si es parcial)' },
  almaRefundType: {
    name: 'Alma Tipo de reembolso',
    description: 'Reembolsa este pedido con el módulo Alma. Esto se aplicará en tu panel de control de alma automáticamente. La cantidad máxima que se puede reembolsar incluye los costes que el cliente tiene que pagar.',
    valueDefinitions: {
      total: 'Total',
      partial: 'Parcialmente'
    }
  },
  AlmaRefund: { name: 'Alma Refund (Reembolsa este pedido con el módulo Alma. Esto se aplicará en tu panel de control de alma automáticamente. La cantidad máxima que se puede reembolsar incluye los costes que el cliente tiene que pagar)' }
};
