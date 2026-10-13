import { ExpenseCategorySnapshot } from '@hexagonal-monorepo-template/domain';
import {
  IAddExpenseCategoryFromSession,
  IListExpenseCategoriesFromSession,
} from '@hexagonal-monorepo-template/ports';

export class ExpenseCategoriesController {
  constructor(
    private readonly listFromSession: IListExpenseCategoriesFromSession,
    private readonly addFromSession: IAddExpenseCategoryFromSession,
  ) {}

  listCategories(): Promise<readonly ExpenseCategorySnapshot[]> {
    return this.listFromSession.execute();
  }

  addCategory(label: string): Promise<readonly ExpenseCategorySnapshot[]> {
    return this.addFromSession.execute(label);
  }
}
