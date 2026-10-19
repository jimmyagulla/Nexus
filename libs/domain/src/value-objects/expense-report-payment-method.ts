/** How an expense was paid. The database enum declares the same values. */
export const ExpenseReportPaymentMethod = {
  PERSONAL_CARD: 'PERSONAL_CARD',
  COMPANY_CARD: 'COMPANY_CARD',
  CASH: 'CASH',
} as const;

export type ExpenseReportPaymentMethod =
  (typeof ExpenseReportPaymentMethod)[keyof typeof ExpenseReportPaymentMethod];

export const EXPENSE_REPORT_PAYMENT_METHODS: readonly ExpenseReportPaymentMethod[] =
  Object.values(ExpenseReportPaymentMethod);

const VALUES = new Set<string>(EXPENSE_REPORT_PAYMENT_METHODS);

export function isExpenseReportPaymentMethod(
  value: string,
): value is ExpenseReportPaymentMethod {
  return VALUES.has(value);
}
