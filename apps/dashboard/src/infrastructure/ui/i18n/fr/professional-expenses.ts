export const professionalExpenses = {
  list: {
    title: 'Frais professionnels',
    description:
      'Forfaits, abonnements, équipement et autres demandes hors notes de frais.',
    newRequest: 'Nouvelle demande',
    complete: 'Compléter',
    search: 'Rechercher une demande',
    expenseReportsHint: 'Dépense à rembourser :',
    expenseReportsLink: 'Notes de frais',
    columns: {
      type: 'Type de frais',
      period: 'Période',
      detail: 'Détail',
      amount: 'Montant',
      status: 'Statut',
    },
  },
  request: {
    title: 'Nouvelle demande de frais professionnels',
    description: "Les catégories et les taux sont définis par l'entreprise.",
    type: '1. Type de frais',
    period: '2. Période',
    calculation: '3. Éléments de calcul',
    days: 'jours',
    times: '×',
    equals: '=',
    calculationHint:
      "Nombre de jours télétravaillés sur la période · taux fixé par l'entreprise",
    description4: '4. Description',
    proof: '5. Justificatif',
    proofHint: '(si nécessaire)',
    submit: 'Transmettre la demande',
  },
} as const;
