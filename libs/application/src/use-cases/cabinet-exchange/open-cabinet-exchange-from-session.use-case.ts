import {
  CabinetExchangeSnapshot,
  CompanyScopedSession,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeGateway,
  IOpenCabinetExchangeFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class OpenCabinetExchangeFromSessionUseCase
  implements IOpenCabinetExchangeFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly exchanges: ICabinetExchangeGateway,
  ) {}

  async execute(exchangeId: string): Promise<CabinetExchangeSnapshot> {
    const session = await this.currentCompanySession();
    return this.exchanges.open(
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
