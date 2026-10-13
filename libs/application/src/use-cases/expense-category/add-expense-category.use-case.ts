import {
  ActorContext,
  assertSameCompany,
  ErrorCode,
  ExpenseCategory,
  ExpenseCategorySnapshot,
  expenseCategoriesOf,
  requireActorRole,
  requireExpenseCategoryLabel,
  toExpenseCategorySnapshots,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddExpenseCategory,
  IExpenseCategoryRepository,
} from '@hexagonal-monorepo-template/ports';

export class AddExpenseCategoryUseCase implements IAddExpenseCategory {
  constructor(private readonly categories: IExpenseCategoryRepository) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    label: string;
  }): Promise<readonly ExpenseCategorySnapshot[]> {
    requireActorRole(input.actor, UserRole.EMPLOYER);
    assertSameCompany(input.companyId, input.actor.companyId);
    const label = requireExpenseCategoryLabel(input.label);
    const offered = await this.offeredCategories(input.companyId);
    this.refuseDuplicate(offered, label);
    await this.categories.insert(input.companyId, label);
    return toExpenseCategorySnapshots(await this.offeredCategories(input.companyId));
  }

  private async offeredCategories(
    companyId: string,
  ): Promise<readonly ExpenseCategory[]> {
    return expenseCategoriesOf(
      companyId,
      await this.categories.listByCompany(companyId),
    );
  }

  private refuseDuplicate(
    offered: readonly ExpenseCategory[],
    label: string,
  ): void {
    const wanted = label.toLowerCase();
    if (offered.some((category) => category.label.toLowerCase() === wanted)) {
      throw new Error(ErrorCode.POTENTIAL_DUPLICATE);
    }
  }
}
