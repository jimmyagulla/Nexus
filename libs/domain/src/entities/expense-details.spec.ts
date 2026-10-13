import { ErrorCode } from '../errors/error-code';
import { ExpenseDetails, ExpenseDetailsInput } from './expense-details';

const valid: ExpenseDetailsInput = {
  date: '2026-10-05',
  categoryId: 'restaurant',
  amount: 45,
  vat: null,
  paymentMethod: 'Carte',
  description: 'Déjeuner client',
  assignment: 'Client Dupont',
};

describe('ExpenseDetails', () => {
  it('describes an expense with its amount in euros', () => {
    const details = ExpenseDetails.parse(valid);

    expect(details.date.value).toBe('2026-10-05');
    expect(details.categoryId).toBe('restaurant');
    expect(details.amount.euros).toBe(45);
    expect(details.vat).toBeNull();
    expect(details.paymentMethod).toBe('Carte');
    expect(details.description).toBe('Déjeuner client');
    expect(details.assignment).toBe('Client Dupont');
  });

  it('keeps an optional VAT that does not exceed the amount', () => {
    expect(ExpenseDetails.parse({ ...valid, vat: 7.5 }).vat?.euros).toBe(7.5);
  });

  it('accepts a VAT equal to the amount', () => {
    expect(ExpenseDetails.parse({ ...valid, vat: 45 }).vat?.euros).toBe(45);
  });

  it('accepts a VAT of zero', () => {
    expect(ExpenseDetails.parse({ ...valid, vat: 0 }).vat?.euros).toBe(0);
  });

  it('refuses a zero amount', () => {
    expect(() => ExpenseDetails.parse({ ...valid, amount: 0 })).toThrow(
      ErrorCode.INVALID_AMOUNT,
    );
  });

  it('refuses a VAT above the amount', () => {
    expect(() => ExpenseDetails.parse({ ...valid, vat: 45.01 })).toThrow(
      ErrorCode.INVALID_VAT,
    );
  });

  it('refuses a negative VAT', () => {
    expect(() => ExpenseDetails.parse({ ...valid, vat: -1 })).toThrow(
      ErrorCode.INVALID_VAT,
    );
  });

  it('reports the amount before the VAT when both are invalid', () => {
    expect(() =>
      ExpenseDetails.parse({ ...valid, amount: 0, vat: 10 }),
    ).toThrow(ErrorCode.INVALID_AMOUNT);
  });

  it.each(['paymentMethod', 'description', 'assignment', 'categoryId'] as const)(
    'refuses a blank %s',
    (field) => {
      expect(() => ExpenseDetails.parse({ ...valid, [field]: '  ' })).toThrow(
        ErrorCode.REQUIRED_INFORMATION,
      );
    },
  );

  it('refuses a malformed date', () => {
    expect(() => ExpenseDetails.parse({ ...valid, date: '05/10/2026' })).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('trims the text fields', () => {
    const details = ExpenseDetails.parse({
      ...valid,
      paymentMethod: ' Carte ',
      description: ' Déjeuner ',
      assignment: ' Projet X ',
    });

    expect([
      details.paymentMethod,
      details.description,
      details.assignment,
    ]).toEqual(['Carte', 'Déjeuner', 'Projet X']);
  });
});
