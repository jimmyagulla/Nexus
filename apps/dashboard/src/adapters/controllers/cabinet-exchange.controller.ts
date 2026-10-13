import {
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';
import {
  ICreateCabinetExchangeDraftFromSession,
  IListCabinetExchangesFromSession,
  IMarkCabinetExchangeToTransmitFromSession,
  ITransmitCabinetExchangesFromSession,
} from '@hexagonal-monorepo-template/ports';

export class CabinetExchangeController {
  constructor(
    private readonly createDraftFromSession: ICreateCabinetExchangeDraftFromSession,
    private readonly markToTransmitFromSession: IMarkCabinetExchangeToTransmitFromSession,
    private readonly transmitFromSession: ITransmitCabinetExchangesFromSession,
    private readonly listFromSession: IListCabinetExchangesFromSession,
  ) {}

  createDraft(input: {
    category?: string | null;
    file?: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot> {
    return this.createDraftFromSession.execute(input);
  }

  markToTransmit(exchangeId: string): Promise<CabinetExchangeSnapshot> {
    return this.markToTransmitFromSession.execute({ exchangeId });
  }

  transmit(
    exchangeIds: readonly string[],
  ): Promise<readonly CabinetExchangeSnapshot[]> {
    return this.transmitFromSession.execute(exchangeIds);
  }

  list(): Promise<readonly CabinetExchangeSnapshot[]> {
    return this.listFromSession.execute();
  }
}
