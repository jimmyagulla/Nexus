import {
  CabinetExchangeSnapshot,
  CompanyScopedSession,
  ExchangeFilters,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeGateway,
  IListCabinetExchangesFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ListCabinetExchangesFromSessionUseCase
  implements IListCabinetExchangesFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly exchanges: ICabinetExchangeGateway,
  ) {}

  async execute(
    filters: ExchangeFilters = {},
  ): Promise<readonly CabinetExchangeSnapshot[]> {
    const session = await this.currentCompanySession();
    return this.exchanges.list(session.companyId, filters, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
