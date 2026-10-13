import { ExpenseCategory } from '@hexagonal-monorepo-template/domain';

export interface IExpenseCategoryRepository {
  insert(companyId: string, label: string): Promise<ExpenseCategory>;
  listByCompany(companyId: string): Promise<readonly ExpenseCategory[]>;
}

export const IExpenseCategoryRepository = Symbol('IExpenseCategoryRepository');
