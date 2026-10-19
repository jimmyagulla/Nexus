/**
 * Handling state of an expense report.
 * Declaration order is the sort order: alphabetical order of the French
 * labels (En cours de traitement, Refusée, Remboursée, Soumise). The database
 * enum declares its values in the same order.
 */
export const ExpenseReportStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  REJECTED: 'REJECTED',
  REFUNDED: 'REFUNDED',
  SUBMITTED: 'SUBMITTED',
} as const;

export type ExpenseReportStatus =
  (typeof ExpenseReportStatus)[keyof typeof ExpenseReportStatus];

export const EXPENSE_REPORT_STATUSES: readonly ExpenseReportStatus[] =
  Object.values(ExpenseReportStatus);

const VALUES = new Set<string>(EXPENSE_REPORT_STATUSES);

export function isExpenseReportStatus(
  value: string,
): value is ExpenseReportStatus {
  return VALUES.has(value);
}

/** A refunded or refused report is processed: it carries a processing date. */
export function isProcessedExpenseReportStatus(
  status: ExpenseReportStatus,
): boolean {
  return (
    status === ExpenseReportStatus.REFUNDED ||
    status === ExpenseReportStatus.REJECTED
  );
}

/** Not yet handled by the employer: its owner may still change it. */
export function isEditableExpenseReportStatus(
  status: ExpenseReportStatus,
): boolean {
  return status === ExpenseReportStatus.SUBMITTED;
}

/** Waiting for its refund: submitted, or being processed. */
export function isPendingExpenseReportStatus(
  status: ExpenseReportStatus,
): boolean {
  return (
    status === ExpenseReportStatus.SUBMITTED ||
    status === ExpenseReportStatus.IN_PROGRESS
  );
}
