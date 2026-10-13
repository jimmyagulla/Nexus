import {
  CabinetExchangeSnapshot,
  CompanyScopedSession,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeGateway,
  ISessionGateway,
  ITransmitCabinetExchangesFromSession,
} from '@hexagonal-monorepo-template/ports';

export class TransmitCabinetExchangesFromSessionUseCase
  implements ITransmitCabinetExchangesFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly exchanges: ICabinetExchangeGateway,
  ) {}

  async execute(
    exchangeIds: readonly string[],
  ): Promise<readonly CabinetExchangeSnapshot[]> {
    const session = await this.currentCompanySession();
    return this.exchanges.transmit(
      session.companyId,
      exchangeIds,
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
