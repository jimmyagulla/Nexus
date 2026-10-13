import {
  ActorContext,
  ExpenseReportLabel,
  ExpenseReportSnapshot,
  requireActiveEmployeeActor,
  toExpenseReportSnapshot,
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
    requireActiveEmployeeActor(
      input.actor,
      input.companyId,
      await this.employees.findById(input.companyId, input.actor.userId),
    );
    const label = ExpenseReportLabel.parse(input.label);
    const report = await this.reports.insert(
      input.companyId,
      input.actor.userId,
      label,
    );
    return toExpenseReportSnapshot(report);
  }
}
