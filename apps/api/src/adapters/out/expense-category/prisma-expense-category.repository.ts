import { ExpenseCategory } from '@hexagonal-monorepo-template/domain';
import { IExpenseCategoryRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';

export class PrismaExpenseCategoryRepository
  implements IExpenseCategoryRepository
{
  constructor(private readonly prisma: PrismaDb) {}

  async insert(companyId: string, label: string): Promise<ExpenseCategory> {
    const row = await this.prisma.expenseCategory.create({
      data: { companyId, label },
    });
    return new ExpenseCategory(row.id, row.companyId, row.label);
  }

  async listByCompany(companyId: string): Promise<readonly ExpenseCategory[]> {
    const rows = await this.prisma.expenseCategory.findMany({
      where: { companyId },
    });
    return rows.map(
      (row) => new ExpenseCategory(row.id, row.companyId, row.label),
    );
  }
}
