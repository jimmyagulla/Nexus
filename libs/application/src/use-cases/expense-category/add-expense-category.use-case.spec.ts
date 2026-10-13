import { InMemoryExpenseCategoryRepository } from '@hexagonal-monorepo-template/adapters';
import {
  ActorContext,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { AddExpenseCategoryUseCase } from './add-expense-category.use-case';

const employer: ActorContext = {
  userId: 'u1',
  companyId: 'c1',
  role: UserRole.EMPLOYER,
};

describe('AddExpenseCategoryUseCase', () => {
  it('adds a category after the starting ones', async () => {
    const useCase = new AddExpenseCategoryUseCase(
      new InMemoryExpenseCategoryRepository(),
    );

    const labels = (
      await useCase.execute({ actor: employer, companyId: 'c1', label: 'Hôtel' })
    ).map((category) => category.label);

    expect(labels).toEqual(['Restaurant', 'Parking', 'Train', 'Autre', 'Hôtel']);
  });

  it('keeps the category on the company', async () => {
    const categories = new InMemoryExpenseCategoryRepository();
    const useCase = new AddExpenseCategoryUseCase(categories);

    await useCase.execute({ actor: employer, companyId: 'c1', label: 'Hôtel' });

    expect(
      (await categories.listByCompany('c1')).map((category) => category.label),
    ).toEqual(['Hôtel']);
  });

  it('trims the label', async () => {
    const categories = new InMemoryExpenseCategoryRepository();
    const useCase = new AddExpenseCategoryUseCase(categories);

    await useCase.execute({ actor: employer, companyId: 'c1', label: ' Hôtel ' });

    expect((await categories.listByCompany('c1'))[0]?.label).toBe('Hôtel');
  });

  it('refuses a blank label', async () => {
    const useCase = new AddExpenseCategoryUseCase(
      new InMemoryExpenseCategoryRepository(),
    );

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', label: '  ' }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('refuses a starting category added again, whatever its case', async () => {
    const useCase = new AddExpenseCategoryUseCase(
      new InMemoryExpenseCategoryRepository(),
    );

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', label: 'train' }),
    ).rejects.toThrow(ErrorCode.POTENTIAL_DUPLICATE);
  });

  it('refuses a category the company already added', async () => {
    const categories = new InMemoryExpenseCategoryRepository();
    await categories.insert('c1', 'Hôtel');
    const useCase = new AddExpenseCategoryUseCase(categories);

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', label: 'Hôtel' }),
    ).rejects.toThrow(ErrorCode.POTENTIAL_DUPLICATE);
  });

  it('lets another company add the same label', async () => {
    const categories = new InMemoryExpenseCategoryRepository();
    await categories.insert('c2', 'Hôtel');
    const useCase = new AddExpenseCategoryUseCase(categories);

    await expect(
      useCase.execute({ actor: employer, companyId: 'c1', label: 'Hôtel' }),
    ).resolves.toHaveLength(5);
  });

  it('refuses an employee', async () => {
    const useCase = new AddExpenseCategoryUseCase(
      new InMemoryExpenseCategoryRepository(),
    );

    await expect(
      useCase.execute({
        actor: { ...employer, role: UserRole.EMPLOYEE },
        companyId: 'c1',
        label: 'Hôtel',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('refuses another company', async () => {
    const useCase = new AddExpenseCategoryUseCase(
      new InMemoryExpenseCategoryRepository(),
    );

    await expect(
      useCase.execute({ actor: employer, companyId: 'c2', label: 'Hôtel' }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
