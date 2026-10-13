import type { ExpenseReportRowModel, ExpenseReportSubmittedViewModel, ExpenseReportViewModel, ExpenseReportsViewModel } from '../../../adapters/presenters/expense-reports/expense-reports.view-models';

/** Placeholder data of the expense reports screens (mockup v3, flow 6). */

const DRAFT_ID = '2026-09';

const pastReports: ExpenseReportRowModel[] = [
  {
    id: '2026-09-salon',
    title: 'Salon Bordeaux',
    period: 'Septembre 2026',
    expenseCount: '1 dépense',
    total: '112,00 €',
    status: { label: 'En cours de validation', tone: 'warning' },
  },
  {
    id: '2026-09-repas',
    title: 'Repas client Valette',
    period: 'Septembre 2026',
    expenseCount: '1 dépense',
    total: '42,50 €',
    status: { label: 'Soumise', tone: 'submitted' },
  },
  {
    id: '2026-08',
    title: 'Note de frais — Août 2026',
    period: 'Août 2026',
    expenseCount: '4 dépenses',
    total: '186,40 €',
    status: { label: 'Remboursée', tone: 'done' },
  },
  {
    id: '2026-07',
    title: 'Note de frais — Juillet 2026',
    period: 'Juillet 2026',
    expenseCount: '2 dépenses',
    total: '58,00 €',
    status: { label: 'Remboursée', tone: 'done' },
  },
];

export const expenseReportsFixture: ExpenseReportsViewModel = {
  draftId: DRAFT_ID,
  kpis: [
    { label: 'En cours · 2 notes', value: '154,50 €', icon: 'ri-receipt-line' },
    { label: 'Remboursé en 2026', value: '1 284,60 €' },
    { label: 'Délai moyen de remboursement', value: '12 jours' },
  ],
  reports: [
    ...pastReports,
    {
      id: '2026-06',
      title: 'Déplacement Nîmes',
      period: 'Juin 2026',
      expenseCount: '1 dépense',
      total: '18,00 €',
      status: { label: 'Refusée', tone: 'danger' },
    },
  ],
};

export const expenseReportFixture: ExpenseReportViewModel = {
  title: 'Note de frais — Septembre 2026',
  status: { label: 'Brouillon', tone: 'draft' },
  expenses: [
    {
      id: 'restaurant',
      date: '12/09/2026',
      category: 'Restaurant',
      categoryIcon: 'ri-restaurant-line',
      description: 'Déjeuner client Valette',
      paymentMethod: 'Carte entreprise',
      vat: '4,09 €',
      amount: '45,00 €',
    },
    {
      id: 'parking',
      date: '12/09/2026',
      category: 'Parking',
      categoryIcon: 'ri-parking-box-line',
      description: 'Parking Polygone',
      paymentMethod: 'Carte personnelle',
      vat: '2,00 €',
      amount: '12,00 €',
    },
    {
      id: 'train',
      date: '28/09/2026',
      category: 'Train',
      categoryIcon: 'ri-train-line',
      description: 'Montpellier – Lyon',
      paymentMethod: 'Carte personnelle',
      vat: '6,18 €',
      amount: '68,00 €',
    },
  ],
  vatTotal: 'dont TVA 12,27 €',
  total: '125,00 €',
  summary: '3 dépenses · 3 justificatifs · validation par Nadia Roussel',
  newExpense: {
    date: '28/09/2026',
    category: 'Train',
    categories: ['Restaurant', 'Parking', 'Train', 'Hôtel', 'Carburant', 'Autre'],
    amount: '68,00',
    vat: '10 % · 6,18 €',
    vatOptions: ['Aucune', '5,5 % · 3,54 €', '10 % · 6,18 €', '20 % · 11,33 €'],
    paymentMethod: 'personal',
    description: 'Montpellier – Lyon, rendez-vous client',
    project: 'Client Valette',
    projects: ['Client Valette', 'Salon Bordeaux', 'Service commercial'],
    proof: { name: 'billet_train_lyon.pdf', details: '214 Ko · Importé' },
  },
};

export const expenseReportSubmittedFixture: ExpenseReportSubmittedViewModel = {
  confirmation: {
    title: 'Votre note de frais de 125,00 € a été soumise pour remboursement.',
    description:
      'Statut : Soumise. Vous serez notifié à chaque étape de la validation.',
  },
  draftId: DRAFT_ID,
  reports: [
    {
      id: DRAFT_ID,
      title: 'Note de frais — Septembre 2026',
      period: 'Septembre 2026',
      expenseCount: '3 dépenses',
      total: '125,00 €',
      status: { label: 'Soumise', tone: 'submitted' },
      highlighted: true,
    },
    ...pastReports,
  ],
};
