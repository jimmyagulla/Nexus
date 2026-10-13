import { ExpenseCategory } from '../entities/expense-category';
import { ExpenseCategorySnapshot } from './expense-category-snapshot';

export function toExpenseCategorySnapshots(
  categories: readonly ExpenseCategory[],
): readonly ExpenseCategorySnapshot[] {
  return categories.map((category) => ({
    id: category.id,
    label: category.label,
  }));
}
