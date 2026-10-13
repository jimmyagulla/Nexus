import {
  ActorContext,
  assertSameCompany,
  ExpenseReport,
  ExpenseReportFilter,
  ExpenseReportFilterInput,
  ExpenseReportListSnapshot,
  ExpenseReportStatus,
  Money,
  requireActorRole,
  toExpenseReportSnapshot,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  IEmployeeRepository,
  IExpenseReportRepository,
  IListExpenseReports,
} from '@hexagonal-monorepo-template/ports';

export class ListExpenseReportsUseCase implements IListExpenseReports {
  constructor(
    private readonly employees: IEmployeeRepository,
    private readonly reports: IExpenseReportRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    filter?: ExpenseReportFilterInput;
  }): Promise<ExpenseReportListSnapshot> {
    requireActorRole(input.actor, UserRole.EMPLOYER, UserRole.EMPLOYEE);
    assertSameCompany(input.companyId, input.actor.companyId);
    const filter = ExpenseReportFilter.parse(input.filter ?? {});
    return input.actor.role === UserRole.EMPLOYER
      ? this.listForEmployer(input.companyId, filter)
      : this.listForEmployee(input.actor, input.companyId, filter);
  }

  private async listForEmployer(
    companyId: string,
    filter: ExpenseReportFilter,
  ): Promise<ExpenseReportListSnapshot> {
    const reports = await this.reports.list(companyId, {});
    return this.snapshotOf(
      this.submitted(reports).filter((report) => filter.matches(report)),
      false,
    );
  }

  private async listForEmployee(
    actor: ActorContext,
    companyId: string,
    filter: ExpenseReportFilter,
  ): Promise<ExpenseReportListSnapshot> {
    const reports = await this.reports.list(companyId, {
      employeeId: actor.userId,
    });
    return this.snapshotOf(
      reports.filter((report) => filter.matches(report)),
      await this.isActiveEmployee(actor, companyId),
    );
  }

  private snapshotOf(
    reports: readonly ExpenseReport[],
    canCreate: boolean,
  ): ExpenseReportListSnapshot {
    return {
      canCreate,
      reports: reports.map(toExpenseReportSnapshot),
      totalAmount: reports.reduce(
        (sum, report) => sum.plus(report.total()),
        Money.zero(),
      ).euros,
    };
  }

  private submitted(reports: readonly ExpenseReport[]): ExpenseReport[] {
    return reports.filter(
      (report) => report.status !== ExpenseReportStatus.DRAFT,
    );
  }

  private async isActiveEmployee(
    actor: ActorContext,
    companyId: string,
  ): Promise<boolean> {
    const employee = await this.employees.findById(companyId, actor.userId);
    return employee?.isActive() ?? false;
  }
}
