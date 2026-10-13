import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { expenseSchema, type ExpenseFormValues } from './expense.schema';

const valid: ExpenseFormValues = {
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: '45',
  vat: '',
  paymentMethod: 'Carte',
  description: 'Déjeuner client',
  assignment: 'Client Dupont',
};

function messagesFor(values: ExpenseFormValues): string[] {
  const result = expenseSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe('expenseSchema', () => {
  it('turns the typed amount into a number of euros', () => {
    expect(expenseSchema.parse(valid)).toEqual({
      date: '2026-10-05',
      categoryId: 'restaurant',
      amount: 45,
      vat: null,
      paymentMethod: 'Carte',
      description: 'Déjeuner client',
      assignment: 'Client Dupont',
    });
  });

  it('accepts a decimal comma', () => {
    expect(
      expenseSchema.parse({ ...valid, amount: '12,50', vat: '2,5' }),
    ).toMatchObject({ amount: 12.5, vat: 2.5 });
  });

  it('keeps an optional VAT', () => {
    expect(expenseSchema.parse({ ...valid, vat: '7.5' }).vat).toBe(7.5);
  });

  it('accepts a VAT equal to the amount', () => {
    expect(expenseSchema.parse({ ...valid, vat: '45' }).vat).toBe(45);
  });

  it('refuses a zero amount', () => {
    expect(messagesFor({ ...valid, amount: '0' })).toEqual([
      ErrorCode.INVALID_AMOUNT,
    ]);
  });

  it('refuses an amount that is not a number', () => {
    expect(messagesFor({ ...valid, amount: 'beaucoup' })).toEqual([
      ErrorCode.INVALID_AMOUNT,
    ]);
  });

  it('refuses a missing amount', () => {
    expect(messagesFor({ ...valid, amount: '' })).toContain(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('refuses a VAT above the amount', () => {
    expect(messagesFor({ ...valid, vat: '45.01' })).toEqual([
      ErrorCode.INVALID_VAT,
    ]);
  });

  it('refuses a negative VAT', () => {
    expect(messagesFor({ ...valid, vat: '-1' })).toEqual([
      ErrorCode.INVALID_VAT,
    ]);
  });

  it.each(['categoryId', 'paymentMethod', 'description', 'assignment'] as const)(
    'refuses a blank %s',
    (field) => {
      expect(messagesFor({ ...valid, [field]: '   ' })).toEqual([
        ErrorCode.REQUIRED_INFORMATION,
      ]);
    },
  );

  it('refuses a missing date', () => {
    expect(messagesFor({ ...valid, date: '' })).toEqual([
      ErrorCode.REQUIRED_INFORMATION,
    ]);
  });
});
