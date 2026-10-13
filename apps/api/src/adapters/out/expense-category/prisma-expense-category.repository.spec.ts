import { describe, expect, it } from 'vitest';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { PrismaExpenseCategoryRepository } from './prisma-expense-category.repository';

type CategoryRow = { id: string; companyId: string; label: string };
type CreateData = { companyId: string; label: string };

function createFakePrisma(seed: CategoryRow[] = []) {
  const rows = [...seed];
  const creates: CreateData[] = [];
  const client = {
    expenseCategory: {
      create: async (args: { data: CreateData }): Promise<CategoryRow> => {
        creates.push(args.data);
        const row = { id: 'generated-category-id', ...args.data };
        rows.push(row);
        return row;
      },
      findMany: async (args: {
        where: { companyId: string };
      }): Promise<CategoryRow[]> =>
        rows.filter((row) => row.companyId === args.where.companyId),
    },
  };
  return { client: client as unknown as PrismaDb, creates };
}

describe('PrismaExpenseCategoryRepository', () => {
  it('lets the database assign the id of a new category', async () => {
    const { client, creates } = createFakePrisma();

    const category = await new PrismaExpenseCategoryRepository(client).insert(
      'c1',
      'Hôtel',
    );

    expect(creates).toEqual([{ companyId: 'c1', label: 'Hôtel' }]);
    expect(category.id).toBe('generated-category-id');
    expect(category.companyId).toBe('c1');
    expect(category.label).toBe('Hôtel');
  });

  it('lists the categories of the company only', async () => {
    const { client } = createFakePrisma([
      { id: 'a', companyId: 'c1', label: 'Hôtel' },
      { id: 'b', companyId: 'c2', label: 'Péage' },
    ]);

    const categories = await new PrismaExpenseCategoryRepository(
      client,
    ).listByCompany('c1');

    expect(categories.map((category) => category.label)).toEqual(['Hôtel']);
  });
});
