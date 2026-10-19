import {
  ExpenseReportSubmission,
  ExpenseReportSummary,
  prepareExpenseReportSubmission,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  ISessionGateway,
  ISubmitExpenseReportFromSession,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

/** Checks the report with the rules of the API before it travels. */
export class SubmitExpenseReportFromSessionUseCase implements ISubmitExpenseReportFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(submission: ExpenseReportSubmission): Promise<ExpenseReportSummary> {
    const draft = prepareExpenseReportSubmission(submission);
    const session = await currentCompanySession(this.sessions);
    return this.reports.submit(session.companyId, draft, session.token);
  }
}
