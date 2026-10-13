import { ErrorCode } from '../errors/error-code';
import { CalendarDate } from '../value-objects/calendar-date';
import { Money } from '../value-objects/money';

export type ExpenseDetailsInput = {
  date: string;
  categoryId: string;
  amount: number;
  vat: number | null;
  paymentMethod: string;
  description: string;
  assignment: string;
};

export class ExpenseDetails {
  private constructor(
    readonly date: CalendarDate,
    readonly categoryId: string,
    readonly amount: Money,
    readonly vat: Money | null,
    readonly paymentMethod: string,
    readonly description: string,
    readonly assignment: string,
  ) {}

  static parse(input: ExpenseDetailsInput): ExpenseDetails {
    const amount = Money.positive(input.amount);
    const vat = ExpenseDetails.parseVat(input.vat, amount);
    return new ExpenseDetails(
      CalendarDate.parse(input.date),
      ExpenseDetails.required(input.categoryId),
      amount,
      vat,
      ExpenseDetails.required(input.paymentMethod),
      ExpenseDetails.required(input.description),
      ExpenseDetails.required(input.assignment),
    );
  }

  private static parseVat(raw: number | null, amount: Money): Money | null {
    if (raw === null) {
      return null;
    }
    const vat = Money.ofCents(Math.round(raw * 100));
    if (raw < 0 || !Number.isFinite(raw) || vat.isGreaterThan(amount)) {
      throw new Error(ErrorCode.INVALID_VAT);
    }
    return vat;
  }

  private static required(raw: string): string {
    const value = raw.trim();
    if (value === '') {
      throw new Error(ErrorCode.REQUIRED_INFORMATION);
    }
    return value;
  }
}
