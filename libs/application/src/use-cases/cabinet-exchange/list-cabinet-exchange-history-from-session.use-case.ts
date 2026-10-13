import {
  CompanyScopedSession,
  ExchangeHistoryEntry,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeGateway,
  IListCabinetExchangeHistoryFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ListCabinetExchangeHistoryFromSessionUseCase
  implements IListCabinetExchangeHistoryFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly exchanges: ICabinetExchangeGateway,
  ) {}

  async execute(
    exchangeId: string | null = null,
  ): Promise<readonly ExchangeHistoryEntry[]> {
    const session = await this.currentCompanySession();
    return this.exchanges.history(
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
