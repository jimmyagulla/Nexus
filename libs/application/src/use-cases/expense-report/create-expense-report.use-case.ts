import {
  ActorContext,
  assertSameCompany,
  ExpenseReportLabel,
  ExpenseReportSnapshot,
  requireActiveEmployee,
  requireActorRole,
  toExpenseReportSnapshot,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import {
  ICreateExpenseReport,
  IEmployeeRepository,
  IExpenseReportRepository,
} from '@hexagonal-monorepo-template/ports';

export class CreateExpenseReportUseCase implements ICreateExpenseReport {
  constructor(
    private readonly employees: IEmployeeRepository,
    private readonly reports: IExpenseReportRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
    label: string;
  }): Promise<ExpenseReportSnapshot> {
    await this.requireActiveEmployeeOfCompany(input.actor, input.companyId);
    const label = ExpenseReportLabel.parse(input.label);
    const report = await this.reports.insert(
      input.companyId,
      input.actor.userId,
      label,
    );
    return toExpenseReportSnapshot(report);
  }

  private async requireActiveEmployeeOfCompany(
    actor: ActorContext,
    companyId: string,
  ): Promise<void> {
    requireActorRole(actor, UserRole.EMPLOYEE);
    assertSameCompany(companyId, actor.companyId);
    requireActiveEmployee(await this.employees.findById(companyId, actor.userId));
  }
}
