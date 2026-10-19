import {
  ExpenseReport,
  OwnerScope,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportRepository,
  NewExpenseReport,
} from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toExpenseReport, toExpenseReportColumns } from './prisma-expense-report.mapper';

/**
 * The list of one owner is read whole: amounts are text, so ordering and
 * bounding them, like the key figures, follows the domain rules in memory.
 */
export class PrismaExpenseReportRepository implements IExpenseReportRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async insert(report: NewExpenseReport): Promise<ExpenseReport> {
    const row = await this.prisma.expenseReport.create({
      data: toExpenseReportColumns(report),
    });
    return toExpenseReport(row);
  }

  async save(report: ExpenseReport): Promise<void> {
    const { companyId, ownerId, submittedAt, ...changes } = toExpenseReportColumns({
      companyId: report.companyId,
      ownerId: report.ownerId,
      date: report.date,
      category: report.category,
      paymentMethod: report.paymentMethod,
      amount: report.amount,
      vat: report.vat,
      description: report.description,
      project: report.project,
      proof: report.proof,
      status: report.status,
      submittedAt: report.submittedAt,
      processedAt: report.processedAt,
    });
    await this.prisma.expenseReport.update({
      where: { id: report.id, companyId, ownerId, submittedAt },
      data: changes,
    });
  }

  async findById(expenseReportId: string): Promise<ExpenseReport | null> {
    const row = await this.prisma.expenseReport.findUnique({
      where: { id: expenseReportId },
    });
    return row === null ? null : toExpenseReport(row);
  }

  async listOwned(scope: OwnerScope): Promise<ExpenseReport[]> {
    const rows = await this.prisma.expenseReport.findMany({
      where: { companyId: scope.companyId, ownerId: scope.ownerId },
      orderBy: [{ date: 'desc' }, { submittedAt: 'desc' }, { id: 'desc' }],
    });
    return rows.map(toExpenseReport);
  }
}
