import { ExpenseCategorySnapshot } from '@hexagonal-monorepo-template/domain';

export interface IExpenseCategoryGateway {
  list(
    companyId: string,
    token: string,
  ): Promise<readonly ExpenseCategorySnapshot[]>;
  add(
    companyId: string,
    label: string,
    token: string,
  ): Promise<readonly ExpenseCategorySnapshot[]>;
}

export const IExpenseCategoryGateway = Symbol('IExpenseCategoryGateway');
