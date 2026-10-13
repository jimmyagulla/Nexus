import { ErrorCode } from '../errors/error-code';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  ExpenseCategory,
  expenseCategoriesOf,
  requireExpenseCategoryLabel,
} from './expense-category';

describe('expense categories', () => {
  it('starts with Restaurant, Parking, Train and Autre', () => {
    expect(DEFAULT_EXPENSE_CATEGORIES.map((category) => category.label)).toEqual(
      ['Restaurant', 'Parking', 'Train', 'Autre'],
    );
  });

  it('offers the default categories to every company', () => {
    expect(expenseCategoriesOf('c1', []).map((category) => category.label)).toEqual(
      ['Restaurant', 'Parking', 'Train', 'Autre'],
    );
  });

  it('appends the categories added by the company after the default ones', () => {
    const added = new ExpenseCategory('cat-1', 'c1', 'Hôtel');

    expect(expenseCategoriesOf('c1', [added]).map((category) => category.label)).toEqual(
      ['Restaurant', 'Parking', 'Train', 'Autre', 'Hôtel'],
    );
  });

  it('binds the default categories to the company', () => {
    expect(
      expenseCategoriesOf('c1', []).every((category) => category.companyId === 'c1'),
    ).toBe(true);
  });

  it('trims the label of a new category', () => {
    expect(requireExpenseCategoryLabel('  Hôtel ')).toBe('Hôtel');
  });

  it('refuses a blank label', () => {
    expect(() => requireExpenseCategoryLabel(' ')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
