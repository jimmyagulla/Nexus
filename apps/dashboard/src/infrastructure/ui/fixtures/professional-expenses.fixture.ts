import type { ProfessionalExpenseRequestViewModel, ProfessionalExpensesViewModel } from '../../../adapters/presenters/professional-expenses/professional-expenses.view-models';

/** Placeholder data of the professional expenses screens (mockup v3, flow 7). */

export const professionalExpensesFixture: ProfessionalExpensesViewModel = {
  pending: {
    title: '1 demande à compléter.',
    description: "Abonnement transport d'octobre : le justificatif est manquant.",
  },
  requests: [
    {
      id: 'transport-2026-10',
      type: 'Abonnement transport',
      icon: 'ri-bus-2-line',
      period: 'Octobre 2026',
      detail: 'Justificatif manquant',
      amount: '37,60 €',
      status: { label: 'À compléter', tone: 'alert' },
    },
    {
      id: 'remote-2026-09',
      type: 'Forfait télétravail',
      icon: 'ri-home-wifi-line',
      period: 'Septembre 2026',
      detail: '12 jours × 2,50 €',
      amount: '30,00 €',
      status: { label: 'Transmise', tone: 'submitted' },
    },
    {
      id: 'transport-2026-09',
      type: 'Abonnement transport',
      icon: 'ri-bus-2-line',
      period: 'Septembre 2026',
      detail: 'Prise en charge 50 %',
      amount: '37,60 €',
      status: { label: 'Validée', tone: 'success' },
    },
    {
      id: 'equipment-2026-08',
      type: 'Équipement professionnel',
      icon: 'ri-computer-line',
      period: 'Août 2026',
      detail: 'Casque audio',
      amount: '89,00 €',
      status: { label: 'En cours de traitement', tone: 'warning' },
    },
    {
      id: 'remote-2026-08',
      type: 'Forfait télétravail',
      icon: 'ri-home-wifi-line',
      period: 'Août 2026',
      detail: 'Période de congés',
      amount: '15,00 €',
      status: { label: 'Refusée', tone: 'danger' },
    },
  ],
};

export const professionalExpenseRequestFixture: ProfessionalExpenseRequestViewModel =
  {
    request: {
      types: [
        {
          value: 'remote-work',
          label: 'Forfait télétravail',
          description: 'Calcul au nombre de jours',
          icon: 'ri-home-wifi-line',
        },
        {
          value: 'transport',
          label: 'Abonnement transport',
          description: 'Prise en charge employeur',
          icon: 'ri-bus-2-line',
        },
        {
          value: 'equipment',
          label: 'Équipement professionnel',
          description: 'Matériel, fournitures',
          icon: 'ri-computer-line',
        },
        {
          value: 'other',
          label: 'Autre',
          description: 'À préciser',
          icon: 'ri-more-line',
        },
      ],
      type: 'remote-work',
      period: 'Octobre 2026',
      periods: ['Août 2026', 'Septembre 2026', 'Octobre 2026'],
      days: '12',
      rate: '2,50 € / jour',
      total: '30,00 €',
      description: 'Télétravail les lundis, mardis et vendredis.',
      proofNotice: 'Non requis pour ce type de frais',
    },
  };
