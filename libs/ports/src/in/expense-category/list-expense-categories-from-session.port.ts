import { ExpenseCategorySnapshot } from '@hexagonal-monorepo-template/domain';

export interface IListExpenseCategoriesFromSession {
  execute(): Promise<readonly ExpenseCategorySnapshot[]>;
}

export const IListExpenseCategoriesFromSession = Symbol(
  'IListExpenseCategoriesFromSession',
);
