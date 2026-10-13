import {
  CabinetExchangeSnapshot,
  CompanyScopedSession,
  ExchangeFileInput,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeGateway,
  ICreateCabinetExchangeDraftFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class CreateCabinetExchangeDraftFromSessionUseCase
  implements ICreateCabinetExchangeDraftFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly exchanges: ICabinetExchangeGateway,
  ) {}

  async execute(input: {
    category?: string | null;
    file?: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot> {
    const session = await this.currentCompanySession();
    return this.exchanges.createDraft(session.companyId, input, session.token);
  }

  private async currentCompanySession(): Promise<CompanyScopedSession> {
    return requireCompanyScopedSession(
      await this.sessions.getAccessToken(),
      await this.sessions.getActor(),
    );
  }
}
