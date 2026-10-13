import {
  ActorContext,
  ExpenseCategorySnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IListExpenseCategories {
  execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<readonly ExpenseCategorySnapshot[]>;
}

export const IListExpenseCategories = Symbol('IListExpenseCategories');
