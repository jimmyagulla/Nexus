import {
  ActorContext,
  ExpenseReportList,
  ExpenseReportListCriteria,
  requireEmployerCompany,
  toExpenseReportList,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IExpenseReportRepository,
  IListEmployeeExpenseReports,
} from '@hexagonal-monorepo-template/ports';

export class ListEmployeeExpenseReportsUseCase implements IListEmployeeExpenseReports {
  constructor(
    private readonly reports: IExpenseReportRepository,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    employeeId: string;
    criteria: ExpenseReportListCriteria;
  }): Promise<ExpenseReportList> {
    const companyId = requireEmployerCompany(input.actor);
    const owned = await this.reports.listOwned({ companyId, ownerId: input.employeeId });
    return toExpenseReportList(owned, input.criteria, this.clock.now());
  }
}
