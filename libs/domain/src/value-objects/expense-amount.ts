import { ErrorCode } from '../errors/error-code';
import { EXPENSE_AMOUNT_MAX_CENTS } from './expense-report-limits';
import { ExpenseVatRate } from './expense-vat-rate';

/**
 * An amount in euros as typed: digits, then up to two decimals after a comma
 * or a dot ("68", "68,5", "68.50").
 */
export const EXPENSE_AMOUNT_PATTERN = /^\d{1,5}(?:[.,]\d{1,2})?$/;

/**
 * An amount in euros. Kept as text with a dot and two decimals ("68.50"),
 * never as a floating number: computations run on whole cents.
 */
export class ExpenseAmount {
  private constructor(readonly cents: number) {}

  /** An amount to pay: strictly positive, up to 99 999,99 €. */
  static parse(raw: string): ExpenseAmount {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    const amount = ExpenseAmount.read(value);
    if (amount === null || amount.cents === 0) {
      throw new Error(ErrorCode.INVALID_INFORMATION);
    }
    return amount;
  }

  /** The amount a text stands for, or null when it is not one. */
  static read(raw: string): ExpenseAmount | null {
    const value = raw.trim();
    if (!EXPENSE_AMOUNT_PATTERN.test(value)) {
      return null;
    }
    const [units, decimals = ''] = value.split(/[.,]/);
    const cents = Number(units) * 100 + Number(decimals.padEnd(2, '0'));
    return cents > EXPENSE_AMOUNT_MAX_CENTS ? null : new ExpenseAmount(cents);
  }

  static ofCents(cents: number): ExpenseAmount {
    if (!Number.isInteger(cents) || cents < 0) {
      throw new Error(ErrorCode.INVALID_INFORMATION);
    }
    return new ExpenseAmount(cents);
  }

  /** "68.50" */
  get value(): string {
    const units = Math.floor(this.cents / 100);
    return `${units}.${String(this.cents % 100).padStart(2, '0')}`;
  }

  /** VAT included in this amount at a rate, to the nearest cent. */
  vatAt(rate: ExpenseVatRate): ExpenseAmount {
    return new ExpenseAmount(Math.round((this.cents * rate) / (100 + rate)));
  }
}

/** Sum of amounts, as text ("0.00" for none). */
export function sumOfExpenseAmounts(amounts: readonly ExpenseAmount[]): ExpenseAmount {
  return ExpenseAmount.ofCents(amounts.reduce((total, amount) => total + amount.cents, 0));
}
