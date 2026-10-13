import { describe, expect, it } from 'vitest';
import { InMemoryExpenseCategoryRepository } from './in-memory-expense-category.repository';

const ASSIGNED_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('InMemoryExpenseCategoryRepository', () => {
  it('assigns an identity to a new category', async () => {
    const category = await new InMemoryExpenseCategoryRepository().insert(
      'c1',
      'Hôtel',
    );

    expect(category.id).toMatch(ASSIGNED_ID);
    expect(category.companyId).toBe('c1');
    expect(category.label).toBe('Hôtel');
  });

  it('lists the categories of the company only', async () => {
    const repository = new InMemoryExpenseCategoryRepository();
    await repository.insert('c1', 'Hôtel');
    await repository.insert('c2', 'Péage');

    const labels = (await repository.listByCompany('c1')).map(
      (category) => category.label,
    );

    expect(labels).toEqual(['Hôtel']);
  });

  it('lists nothing for a company without added category', async () => {
    await expect(
      new InMemoryExpenseCategoryRepository().listByCompany('c1'),
    ).resolves.toEqual([]);
  });
});
