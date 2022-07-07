/* eslint-disable max-len */
exports.messages = {
  x_times_payment: {
    title: 'Activer le paiement en [[installments]] fois',
    min: 'Montant minimum de la commande pour permettre [[installments]]x paiement échelonné',
    min_disclamer: 'N.B. vous ne pouvez pas aller plus bas que [[amount]] (veuillez contacter votre vendeur Alma si vous voulez le changer).',
    max: 'Montant maximal de la commande pour permettre [[installments]]x paiement échelonné',
    max_disclamer: 'N.B. vous ne pouvez pas aller plus haut que [[amount]] (veuillez contacter votre vendeur Alma si vous voulez le changer).',
    group: 'Alma [[installments]]x'
  },
  deferred_payment: {
    title: 'Activate or deactivate payment @ +[[deferredDays]] days',
    min: 'Montant minimum de la commande pour permettre le paiement @ + [[deferredDays]] jours',
    min_disclamer: 'N.B. vous ne pouvez pas aller plus bas que [[amount]] (veuillez contacter votre vendeur Alma si vous voulez le changer).',
    max: 'Montant maximal de la commande pour permettre le paiement @ + [[deferredDays]] jours',
    max_disclamer: 'N.B. vous ne pouvez pas aller plus haut que [[amount]] (veuillez contacter votre vendeur Alma si vous voulez le changer).',
    group: 'Alma D+[[deferredDays]]'
  },
  x_times_deferred_payment: {
    title: 'Activate or deactivate [[installments]]x installment payment @ +[[deferredDays]] days',
    min: 'Montant minimum de la commande pour permettre [[installments]]x paiement échelonné @ +[[deferredDays]] jours',
    min_disclamer: 'N.B. vous ne pouvez pas aller plus bas que [[amount]] (veuillez contacter votre vendeur Alma si vous voulez le changer).',
    max: 'Montant maximal de la commande pour permettre [[installments]]x paiement échelonné @ +[[deferredDays]] jours',
    max_disclamer: 'N.B. vous ne pouvez pas aller plus haut que [[amount]] (veuillez contacter votre vendeur Alma si vous voulez le changer).',
    group: 'Alma [[installments]]x @ D [[deferredDays]]'
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
