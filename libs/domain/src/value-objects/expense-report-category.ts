/**
 * What an expense was spent on.
 * Declaration order is the sort order: alphabetical order of the French
 * labels (Autre, Carburant, Déplacement, Hôtel, Parking, Restauration). The
 * database enum declares its values in the same order.
 */
export const ExpenseReportCategory = {
  OTHER: 'OTHER',
  FUEL: 'FUEL',
  TRAVEL: 'TRAVEL',
  HOTEL: 'HOTEL',
  PARKING: 'PARKING',
  MEAL: 'MEAL',
} as const;

export type ExpenseReportCategory =
  (typeof ExpenseReportCategory)[keyof typeof ExpenseReportCategory];

export const EXPENSE_REPORT_CATEGORIES: readonly ExpenseReportCategory[] =
  Object.values(ExpenseReportCategory);

const VALUES = new Set<string>(EXPENSE_REPORT_CATEGORIES);

export function isExpenseReportCategory(
  value: string,
): value is ExpenseReportCategory {
  return VALUES.has(value);
}
