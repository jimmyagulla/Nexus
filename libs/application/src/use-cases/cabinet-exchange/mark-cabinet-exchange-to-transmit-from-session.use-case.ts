import {
  CabinetExchangeSnapshot,
  CompanyScopedSession,
  ExchangeFileInput,
  requireCompanyScopedSession,
} from '@hexagonal-monorepo-template/domain';
import {
  ICabinetExchangeGateway,
  IMarkCabinetExchangeToTransmitFromSession,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class MarkCabinetExchangeToTransmitFromSessionUseCase
  implements IMarkCabinetExchangeToTransmitFromSession
{
  constructor(
    private readonly sessions: ISessionGateway,
    private readonly exchanges: ICabinetExchangeGateway,
  ) {}

  async execute(input: {
    exchangeId: string;
    category?: string | null;
    file?: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot> {
    const session = await this.currentCompanySession();
    return this.exchanges.markToTransmit(
      session.companyId,
      input.exchangeId,
      { category: input.category, file: input.file },
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
