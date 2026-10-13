import {
  Expense,
  ExpenseDetails,
  ExpenseReport,
  ExpenseReportLabel,
} from '@hexagonal-monorepo-template/domain';
import {
  ExpenseReportCriteria,
  IExpenseReportRepository,
} from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toExpense, toExpenseReport } from './prisma-expense-report.mapper';

const reportInclude = {
  expenses: { orderBy: { createdAt: 'asc' } },
} as const;

export class PrismaExpenseReportRepository implements IExpenseReportRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async insert(
    companyId: string,
    employeeId: string,
    label: ExpenseReportLabel,
  ): Promise<ExpenseReport> {
    const row = await this.prisma.expenseReport.create({
      data: { companyId, employeeId, label: label.value },
      include: reportInclude,
    });
    return toExpenseReport(row);
  }

  async findById(
    companyId: string,
    reportId: string,
  ): Promise<ExpenseReport | null> {
    const row = await this.prisma.expenseReport.findFirst({
      where: { id: reportId, companyId },
      include: reportInclude,
    });
    return row === null ? null : toExpenseReport(row);
  }

  async insertExpense(
    reportId: string,
    details: ExpenseDetails,
  ): Promise<Expense> {
    const row = await this.prisma.expense.create({
      data: {
        reportId,
        date: details.date.value,
        categoryId: details.categoryId,
        amountCents: details.amount.cents,
        vatCents: details.vat === null ? null : details.vat.cents,
        paymentMethod: details.paymentMethod,
        description: details.description,
        assignment: details.assignment,
      },
    });
    return toExpense(row);
  }

  async list(
    companyId: string,
    criteria: ExpenseReportCriteria,
  ): Promise<readonly ExpenseReport[]> {
    const rows = await this.prisma.expenseReport.findMany({
      where: {
        companyId,
        ...(criteria.employeeId === undefined
          ? {}
          : { employeeId: criteria.employeeId }),
      },
      include: reportInclude,
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(toExpenseReport);
  }
}
