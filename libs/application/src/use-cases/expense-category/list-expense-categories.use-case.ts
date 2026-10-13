import {
  ActorContext,
  assertSameCompany,
  ExpenseCategorySnapshot,
  expenseCategoriesOf,
  requireActorRole,
  toExpenseCategorySnapshots,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseCategoryRepository,
  IListExpenseCategories,
} from '@hexagonal-monorepo-template/ports';

export class ListExpenseCategoriesUseCase implements IListExpenseCategories {
  constructor(private readonly categories: IExpenseCategoryRepository) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<readonly ExpenseCategorySnapshot[]> {
    requireActorRole(input.actor, UserRole.EMPLOYER, UserRole.EMPLOYEE);
    assertSameCompany(input.companyId, input.actor.companyId);
    const added = await this.categories.listByCompany(input.companyId);
    return toExpenseCategorySnapshots(expenseCategoriesOf(input.companyId, added));
  }
}
