import {
  ExpenseReportList,
  ExpenseReportListCriteria,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  IListExpenseReportsFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class ListExpenseReportsFromSessionUseCase implements IListExpenseReportsFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(criteria: ExpenseReportListCriteria): Promise<ExpenseReportList> {
    const session = await currentCompanySession(this.sessions);
    return this.reports.list(session.companyId, criteria, session.token);
  }
}
