import {
  ActorContext,
  ExpenseReportList,
  ExpenseReportListCriteria,
  requireOwnerScope,
  toExpenseReportList,
} from '@hexagonal-monorepo-template/domain';
import {
  IClock,
  IExpenseReportRepository,
  IListExpenseReports,
} from '@hexagonal-monorepo-template/ports';

export class ListExpenseReportsUseCase implements IListExpenseReports {
  constructor(
    private readonly reports: IExpenseReportRepository,
    private readonly clock: IClock,
  ) {}

  async execute(input: {
    actor: ActorContext;
    criteria: ExpenseReportListCriteria;
  }): Promise<ExpenseReportList> {
    const owned = await this.reports.listOwned(requireOwnerScope(input.actor));
    return toExpenseReportList(owned, input.criteria, this.clock.now());
  }
}
