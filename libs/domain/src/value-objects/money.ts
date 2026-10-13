import { ErrorCode } from '../errors/error-code';

const CENTS_PER_EURO = 100;

export class Money {
  private constructor(readonly cents: number) {}

  static positive(euros: number): Money {
    const cents = Math.round(euros * CENTS_PER_EURO);
    if (!Number.isFinite(euros) || euros <= 0 || !Money.isWholeCents(euros)) {
      throw new Error(ErrorCode.INVALID_AMOUNT);
    }
    return new Money(cents);
  }

  static zero(): Money {
    return new Money(0);
  }

  static ofCents(cents: number): Money {
    return new Money(cents);
  }

  get euros(): number {
    return this.cents / CENTS_PER_EURO;
  }

  plus(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  isGreaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  private static isWholeCents(euros: number): boolean {
    const scaled = euros * CENTS_PER_EURO;
    return Math.abs(scaled - Math.round(scaled)) < 1e-6;
  }
}
