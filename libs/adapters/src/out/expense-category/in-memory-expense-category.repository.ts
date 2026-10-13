import { ExpenseCategory } from '@hexagonal-monorepo-template/domain';
import { IExpenseCategoryRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryExpenseCategoryRepository
  implements IExpenseCategoryRepository
{
  constructor(
    private readonly categories = new Map<string, ExpenseCategory>(),
  ) {}

  async insert(companyId: string, label: string): Promise<ExpenseCategory> {
    const category = new ExpenseCategory(
      globalThis.crypto.randomUUID(),
      companyId,
      label,
    );
    this.categories.set(category.id, category);
    return category;
  }

  async listByCompany(companyId: string): Promise<readonly ExpenseCategory[]> {
    return [...this.categories.values()].filter(
      (category) => category.companyId === companyId,
    );
  }
}
