import { ErrorCode } from '../errors/error-code';
import { Money } from './money';

describe('Money', () => {
  it('keeps a positive amount of euros', () => {
    expect(Money.positive(45).euros).toBe(45);
  });

  it('keeps cents without floating point drift', () => {
    expect(Money.positive(0.1).plus(Money.positive(0.2)).euros).toBe(0.3);
  });

  it('refuses a zero amount', () => {
    expect(() => Money.positive(0)).toThrow(ErrorCode.INVALID_AMOUNT);
  });

  it('refuses a negative amount', () => {
    expect(() => Money.positive(-5)).toThrow(ErrorCode.INVALID_AMOUNT);
  });

  it('refuses an amount that is not a number', () => {
    expect(() => Money.positive(Number.NaN)).toThrow(ErrorCode.INVALID_AMOUNT);
    expect(() => Money.positive(Number.POSITIVE_INFINITY)).toThrow(
      ErrorCode.INVALID_AMOUNT,
    );
  });

  it('refuses an amount finer than a cent', () => {
    expect(() => Money.positive(1.005)).toThrow(ErrorCode.INVALID_AMOUNT);
  });

  it('starts a sum from zero', () => {
    expect(Money.zero().euros).toBe(0);
  });

  it('adds two amounts', () => {
    expect(Money.positive(45).plus(Money.positive(12)).euros).toBe(57);
  });

  it('compares two amounts', () => {
    expect(Money.positive(13).isGreaterThan(Money.positive(12))).toBe(true);
    expect(Money.positive(12).isGreaterThan(Money.positive(12))).toBe(false);
  });

  it('knows when two amounts are equal', () => {
    expect(Money.positive(12).equals(Money.positive(12))).toBe(true);
    expect(Money.positive(12).equals(Money.positive(13))).toBe(false);
  });

  it('rebuilds an amount from stored cents', () => {
    expect(Money.ofCents(1250).euros).toBe(12.5);
  });
});
