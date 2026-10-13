import { ExpenseCategory } from '../entities/expense-category';
import { ErrorCode } from '../errors/error-code';
import { requireOfferedExpenseCategory } from './require-offered-expense-category';

const hotel = new ExpenseCategory('cat-1', 'c1', 'Hôtel');

describe('requireOfferedExpenseCategory', () => {
  it('accepts a starting category', () => {
    expect(() =>
      requireOfferedExpenseCategory('c1', [], 'restaurant'),
    ).not.toThrow();
  });

  it('accepts a category added by the company', () => {
    expect(() =>
      requireOfferedExpenseCategory('c1', [hotel], 'cat-1'),
    ).not.toThrow();
  });

  it('refuses a category the company does not offer', () => {
    expect(() => requireOfferedExpenseCategory('c1', [hotel], 'cat-9')).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });
});
