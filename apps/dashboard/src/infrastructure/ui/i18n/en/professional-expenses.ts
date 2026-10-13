export const professionalExpenses = {
  list: {
    title: 'Professional expenses',
    description:
      'Allowances, subscriptions, equipment and other requests outside expense reports.',
    newRequest: 'New request',
    complete: 'Complete',
    search: 'Search a request',
    expenseReportsHint: 'Expense to refund:',
    expenseReportsLink: 'Expense reports',
    columns: {
      type: 'Expense type',
      period: 'Period',
      detail: 'Detail',
      amount: 'Amount',
      status: 'Status',
    },
  },
  request: {
    title: 'New professional expense request',
    description: 'Categories and rates are set by the company.',
    type: '1. Expense type',
    period: '2. Period',
    calculation: '3. Calculation',
    days: 'days',
    times: '×',
    equals: '=',
    calculationHint:
      'Number of days worked from home over the period · rate set by the company',
    description4: '4. Description',
    proof: '5. Receipt',
    proofHint: '(if needed)',
    submit: 'Send the request',
  },
} as const;
