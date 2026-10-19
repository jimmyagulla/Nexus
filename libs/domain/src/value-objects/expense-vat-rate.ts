/** VAT rates an expense may carry, in percent. */
export const EXPENSE_VAT_RATES = [5, 10, 20] as const;

export type ExpenseVatRate = (typeof EXPENSE_VAT_RATES)[number];

export function isExpenseVatRate(value: number): value is ExpenseVatRate {
  return (EXPENSE_VAT_RATES as readonly number[]).includes(value);
}
