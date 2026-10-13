import {
  CompanyScopedSession,
  ReceiptFileSnapshot,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  IExpenseReportGateway,
  IGetReceiptFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class GetReceiptFromSessionUseCase implements IGetReceiptFromSession {
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly reports: IExpenseReportGateway,
  ) {}

  async execute(input: {
    reportId: string;
    receiptId: string;
  }): Promise<ReceiptFileSnapshot> {
    const session = await this.currentCompanySession();
    return this.reports.getReceipt(
      session.companyId,
      input.reportId,
      input.receiptId,
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
