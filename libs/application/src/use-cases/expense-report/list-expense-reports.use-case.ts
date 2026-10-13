import {
  ActorContext,
  assertSameCompany,
  ExpenseReport,
  ExpenseReportListSnapshot,
  ExpenseReportStatus,
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
  }): Promise<ExpenseReportListSnapshot> {
    requireActorRole(input.actor, UserRole.EMPLOYER, UserRole.EMPLOYEE);
    assertSameCompany(input.companyId, input.actor.companyId);
    return input.actor.role === UserRole.EMPLOYER
      ? this.listForEmployer(input.companyId)
      : this.listForEmployee(input.actor, input.companyId);
  }

  private async listForEmployer(
    companyId: string,
  ): Promise<ExpenseReportListSnapshot> {
    const reports = await this.reports.list(companyId, {});
    return {
      canCreate: false,
      reports: this.submitted(reports).map(toExpenseReportSnapshot),
    };
  }

  private async listForEmployee(
    actor: ActorContext,
    companyId: string,
  ): Promise<ExpenseReportListSnapshot> {
    const reports = await this.reports.list(companyId, {
      employeeId: actor.userId,
    });
    return {
      canCreate: await this.isActiveEmployee(actor, companyId),
      reports: reports.map(toExpenseReportSnapshot),
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
