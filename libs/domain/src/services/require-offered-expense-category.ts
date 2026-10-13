import {
  ExpenseCategory,
  expenseCategoriesOf,
} from '../entities/expense-category';
import { ErrorCode } from '../errors/error-code';

export function requireOfferedExpenseCategory(
  companyId: string,
  added: readonly ExpenseCategory[],
  categoryId: string,
): void {
  const offered = expenseCategoriesOf(companyId, added);
  if (!offered.some((category) => category.id === categoryId)) {
    throw new Error(ErrorCode.REQUIRED_INFORMATION);
  }
}
