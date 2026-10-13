import {
  Expense,
  ExpenseDetails,
  ExpenseReport,
  ExpenseReportLabel,
  Receipt,
  ReceiptDetails,
} from '@hexagonal-monorepo-template/domain';
import {
  ExpenseReportCriteria,
  IExpenseReportRepository,
} from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import {
  toExpense,
  toExpenseReport,
  toReceipt,
} from './prisma-expense-report.mapper';

const reportInclude = {
  expenses: { orderBy: { createdAt: 'asc' } },
  receipts: { orderBy: { createdAt: 'asc' } },
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
      data: { reportId, ...this.toRecord(details) },
    });
    return toExpense(row);
  }

  async saveExpense(reportId: string, expense: Expense): Promise<void> {
    await this.prisma.expense.updateMany({
      where: { id: expense.id, reportId },
      data: this.toRecord(expense.details),
    });
  }

  async deleteExpense(reportId: string, expenseId: string): Promise<void> {
    await this.prisma.expense.deleteMany({
      where: { id: expenseId, reportId },
    });
  }

  private toRecord(details: ExpenseDetails) {
    return {
      date: details.date.value,
      categoryId: details.categoryId,
      amountCents: details.amount.cents,
      vatCents: details.vat === null ? null : details.vat.cents,
      paymentMethod: details.paymentMethod,
      description: details.description,
      assignment: details.assignment,
    };
  }

  async insertReceipt(
    reportId: string,
    details: ReceiptDetails,
  ): Promise<Receipt> {
    const row = await this.prisma.receipt.create({
      data: {
        reportId,
        expenseId: details.expenseId,
        fileName: details.fileName,
        mimeType: details.mimeType,
        content: Buffer.from(details.content),
      },
    });
    return toReceipt(row);
  }

  async save(report: ExpenseReport): Promise<void> {
    await this.prisma.expenseReport.update({
      where: { id: report.id },
      data: {
        label: report.label.value,
        status: report.status,
        reimbursedCents:
          report.reimbursedAmount === null ? null : report.reimbursedAmount.cents,
      },
    });
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
