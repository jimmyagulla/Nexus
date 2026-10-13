import {
  ActorContext,
  ExpenseCategorySnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IAddExpenseCategory {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    label: string;
  }): Promise<readonly ExpenseCategorySnapshot[]>;
}

export const IAddExpenseCategory = Symbol('IAddExpenseCategory');
