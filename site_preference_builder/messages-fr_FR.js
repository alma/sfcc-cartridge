/* eslint-disable max-len */
exports.messages = {
  x_times_payment: {
    title: 'Activer le paiement en [[installments]] fois',
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
  almaRefundedAmount: { name: 'ALMA Montant remboursé' },
  almaWantedRefundAmount: { name: 'Montant du remboursement ALMA (si partiel)' },
  almaRefundType: {
    name: 'Alma Type de remboursement',
    description: 'Remboursez cette commande avec le module Alma. Cette opération sera appliquée automatiquement dans votre tableau de bord Alma. Le montant maximum qui peut être remboursé inclut les frais que le client doit payer.',
    valueDefinitions: {
      total: 'Total',
      partial: 'Partiel'
    }
  },
  AlmaRefund: { name: 'Remboursement Alma (Remboursez cette commande avec le module Alma. Ceci sera appliqué dans votre tableau de bord alma automatiquement. Le montant maximum qui peut être remboursé inclut les frais que le client doit payer)' }
};
