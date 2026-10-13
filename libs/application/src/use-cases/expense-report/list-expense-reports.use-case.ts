import {
  ActorContext,
  assertSameCompany,
  ExpenseReportListSnapshot,
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
    requireActorRole(input.actor, UserRole.EMPLOYEE);
    assertSameCompany(input.companyId, input.actor.companyId);
    const reports = await this.reports.list(input.companyId, {
      employeeId: input.actor.userId,
    });
    return {
      canCreate: await this.isActiveEmployee(input),
      reports: reports.map(toExpenseReportSnapshot),
    };
  }

  private async isActiveEmployee(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<boolean> {
    const employee = await this.employees.findById(
      input.companyId,
      input.actor.userId,
    );
    return employee?.isActive() ?? false;
  }
}
