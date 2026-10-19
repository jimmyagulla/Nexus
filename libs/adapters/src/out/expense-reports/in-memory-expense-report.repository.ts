import {
  ExpenseReport,
  OwnerScope,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportRepository,
  IIdGenerator,
  NewExpenseReport,
} from '@hexagonal-monorepo-template/ports';

export class InMemoryExpenseReportRepository implements IExpenseReportRepository {
  constructor(
    private readonly ids: IIdGenerator,
    private readonly reports = new Map<string, ExpenseReport>(),
  ) {}

  async insert(report: NewExpenseReport): Promise<ExpenseReport> {
    const inserted = new ExpenseReport({ ...report, id: this.ids.next() });
    this.reports.set(inserted.id, inserted);
    return inserted;
  }

  async save(report: ExpenseReport): Promise<void> {
    this.reports.set(report.id, report);
  }

  async findById(expenseReportId: string): Promise<ExpenseReport | null> {
    return this.reports.get(expenseReportId) ?? null;
  }

  async listOwned(scope: OwnerScope): Promise<ExpenseReport[]> {
    return [...this.reports.values()].filter((report) =>
      report.isOwnedBy(scope.companyId, scope.ownerId),
    );
  }
}
