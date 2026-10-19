/** Whether an expense report carries its receipt. */
export const ExpenseReportProofPresence = {
  WITH: 'WITH',
  WITHOUT: 'WITHOUT',
} as const;

export type ExpenseReportProofPresence =
  (typeof ExpenseReportProofPresence)[keyof typeof ExpenseReportProofPresence];

export const EXPENSE_REPORT_PROOF_PRESENCES: readonly ExpenseReportProofPresence[] =
  Object.values(ExpenseReportProofPresence);

const VALUES = new Set<string>(EXPENSE_REPORT_PROOF_PRESENCES);

export function isExpenseReportProofPresence(
  value: string,
): value is ExpenseReportProofPresence {
  return VALUES.has(value);
}
