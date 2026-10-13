import {
  CompanyScopedSession,
  ExpenseReportSnapshot,
  ReceiptDetailsInput,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IAttachReceiptFromSession,
  IExpenseReportGateway,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class AttachReceiptFromSessionUseCase
  implements IAttachReceiptFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(input: {
    reportId: string;
    receipt: ReceiptDetailsInput;
  }): Promise<ExpenseReportSnapshot> {
    const session = await this.currentCompanySession();
    return this.reports.attachReceipt(
      session.companyId,
      input.reportId,
      input.receipt,
      session.token,
    );
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
