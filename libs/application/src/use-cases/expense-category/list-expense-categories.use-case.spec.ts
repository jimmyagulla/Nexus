import { InMemoryExpenseCategoryRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { ListExpenseCategoriesUseCase } from './list-expense-categories.use-case';

const employee: ActorContext = {
  userId: 'e1',
  companyId: 'c1',
  role: UserRole.EMPLOYEE,
};

describe('ListExpenseCategoriesUseCase', () => {
  it('offers the starting categories to a company that added none', async () => {
    const useCase = new ListExpenseCategoriesUseCase(
      new InMemoryExpenseCategoryRepository(),
    );

    const labels = (
      await useCase.execute({ actor: employee, companyId: 'c1' })
    ).map((category) => category.label);

    expect(labels).toEqual(['Restaurant', 'Parking', 'Train', 'Autre']);
  });

  it('adds the categories of the company after the starting ones', async () => {
    const categories = new InMemoryExpenseCategoryRepository();
    await categories.insert('c1', 'Hôtel');
    await categories.insert('c2', 'Péage');
    const useCase = new ListExpenseCategoriesUseCase(categories);

    const labels = (
      await useCase.execute({
        actor: { ...employee, role: UserRole.EMPLOYER },
        companyId: 'c1',
      })
    ).map((category) => category.label);

    expect(labels).toEqual(['Restaurant', 'Parking', 'Train', 'Autre', 'Hôtel']);
  });

  it('refuses the accounting firm', async () => {
    const useCase = new ListExpenseCategoriesUseCase(
      new InMemoryExpenseCategoryRepository(),
    );

    await expect(
      useCase.execute({
        actor: { ...employee, role: UserRole.ACCOUNTANT },
        companyId: 'c1',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses another company', async () => {
    const useCase = new ListExpenseCategoriesUseCase(
      new InMemoryExpenseCategoryRepository(),
    );

    await expect(
      useCase.execute({ actor: employee, companyId: 'c2' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
