import { ExpenseCategorySnapshot } from '@hexagonal-monorepo-template/domain';

export interface IAddExpenseCategoryFromSession {
  execute(label: string): Promise<readonly ExpenseCategorySnapshot[]>;
}

export const IAddExpenseCategoryFromSession = Symbol(
  'IAddExpenseCategoryFromSession',
);
