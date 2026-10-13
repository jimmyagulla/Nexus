import {
  ExchangeFileInput,
  CompanyScopedSession,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeGateway,
  IDownloadCabinetExchangeFileFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class DownloadCabinetExchangeFileFromSessionUseCase
  implements IDownloadCabinetExchangeFileFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly exchanges: ICabinetExchangeGateway,
  ) {}

  async execute(exchangeId: string): Promise<ExchangeFileInput> {
    const session = await this.currentCompanySession();
    return this.exchanges.download(
      session.companyId,
      exchangeId,
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
