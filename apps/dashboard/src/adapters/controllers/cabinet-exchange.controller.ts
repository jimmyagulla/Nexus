import {
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';
import {
  ICreateCabinetExchangeDraftFromSession,
  IDownloadCabinetExchangeFileFromSession,
  IListCabinetExchangesFromSession,
  IMarkCabinetExchangeToTransmitFromSession,
  IOpenCabinetExchangeFromSession,
  ITransmitCabinetExchangesFromSession,
} from '@hexagonal-monorepo-template/ports';

export class CabinetExchangeController {
  constructor(
    private readonly createDraftFromSession: ICreateCabinetExchangeDraftFromSession,
    private readonly markToTransmitFromSession: IMarkCabinetExchangeToTransmitFromSession,
    private readonly transmitFromSession: ITransmitCabinetExchangesFromSession,
    private readonly listFromSession: IListCabinetExchangesFromSession,
    private readonly openFromSession: IOpenCabinetExchangeFromSession,
    private readonly downloadFromSession: IDownloadCabinetExchangeFileFromSession,
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

  open(exchangeId: string): Promise<CabinetExchangeSnapshot> {
    return this.openFromSession.execute(exchangeId);
  }

  download(exchangeId: string): Promise<ExchangeFileInput> {
    return this.downloadFromSession.execute(exchangeId);
  }
}
