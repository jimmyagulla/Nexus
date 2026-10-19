import { ExpenseReportProofLink } from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  ISessionGateway,
  IViewExpenseReportProofFromSession,
} from '@hexagonal-monorepo-template/ports';
import { currentCompanySession } from '../../session/current-company-session';

export class ViewExpenseReportProofFromSessionUseCase implements IViewExpenseReportProofFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(expenseReportId: string): Promise<ExpenseReportProofLink> {
    const session = await currentCompanySession(this.sessions);
    return this.reports.viewProof(session.companyId, expenseReportId, session.token);
  }
}
