import { ExpenseCategory } from '../entities/expense-category';
import { toExpenseCategorySnapshots } from './to-expense-category-snapshots';

describe('toExpenseCategorySnapshots', () => {
  it('exposes every category as an identity and a label', () => {
    expect(
      toExpenseCategorySnapshots([
        new ExpenseCategory('restaurant', 'c1', 'Restaurant'),
        new ExpenseCategory('cat-1', 'c1', 'Hôtel'),
      ]),
    ).toEqual([
      { id: 'restaurant', label: 'Restaurant' },
      { id: 'cat-1', label: 'Hôtel' },
    ]);
  });
});
