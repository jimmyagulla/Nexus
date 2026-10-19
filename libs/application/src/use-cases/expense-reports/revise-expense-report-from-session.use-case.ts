import {
  ExpenseReportRevision,
  ExpenseReportSummary,
  prepareExpenseReportRevision,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  IReviseExpenseReportFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

/** Checks the change with the rules of the API before it travels. */
export class ReviseExpenseReportFromSessionUseCase implements IReviseExpenseReportFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(input: {
    expenseReportId: string;
    revision: ExpenseReportRevision;
  }): Promise<ExpenseReportSummary> {
    const draft = prepareExpenseReportRevision(input.revision);
    const session = await currentCompanySession(this.sessions);
    return this.reports.revise(session.companyId, input.expenseReportId, draft, session.token);
  }
}
