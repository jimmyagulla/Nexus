export const ExpenseReportStatus = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  VALIDATED: 'VALIDATED',
  REFUSED: 'REFUSED',
  REIMBURSED: 'REIMBURSED',
} as const;

export type ExpenseReportStatus =
  (typeof ExpenseReportStatus)[keyof typeof ExpenseReportStatus];
