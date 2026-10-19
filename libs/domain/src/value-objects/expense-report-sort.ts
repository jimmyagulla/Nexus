/** Columns an expense reports list can be ordered by. */
export const ExpenseReportSort = {
  DATE: 'DATE',
  CATEGORY: 'CATEGORY',
  PROJECT: 'PROJECT',
  AMOUNT: 'AMOUNT',
  STATUS: 'STATUS',
  PROOF: 'PROOF',
} as const;

export type ExpenseReportSort =
  (typeof ExpenseReportSort)[keyof typeof ExpenseReportSort];

export const EXPENSE_REPORT_SORTS: readonly ExpenseReportSort[] =
  Object.values(ExpenseReportSort);

export const DEFAULT_EXPENSE_REPORT_SORT: ExpenseReportSort = ExpenseReportSort.DATE;

const VALUES = new Set<string>(EXPENSE_REPORT_SORTS);

export function isExpenseReportSort(value: string): value is ExpenseReportSort {
  return VALUES.has(value);
}

/** Direction of an ordering. */
export const ExpenseReportSortDirection = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type ExpenseReportSortDirection =
  (typeof ExpenseReportSortDirection)[keyof typeof ExpenseReportSortDirection];

export const EXPENSE_REPORT_SORT_DIRECTIONS: readonly ExpenseReportSortDirection[] =
  Object.values(ExpenseReportSortDirection);

/** Without a chosen ordering, the most recent expenses come first. */
export const DEFAULT_EXPENSE_REPORT_SORT_DIRECTION: ExpenseReportSortDirection =
  ExpenseReportSortDirection.DESC;
