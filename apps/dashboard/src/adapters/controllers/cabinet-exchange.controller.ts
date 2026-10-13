import {
  CabinetExchangeSnapshot,
  ExchangeFileInput,
  ExchangeFilters,
  ExchangeHistoryEntry,
} from '@hexagonal-monorepo-template/domain';
import {
  ICreateCabinetExchangeDraftFromSession,
  IDepositCabinetExchangeFromSession,
  IDownloadCabinetExchangeFileFromSession,
  IListCabinetExchangeHistoryFromSession,
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
    private readonly depositFromSession: IDepositCabinetExchangeFromSession,
    private readonly historyFromSession: IListCabinetExchangeHistoryFromSession,
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

  list(
    filters: ExchangeFilters = {},
  ): Promise<readonly CabinetExchangeSnapshot[]> {
    return this.listFromSession.execute(filters);
  }

  open(exchangeId: string): Promise<CabinetExchangeSnapshot> {
    return this.openFromSession.execute(exchangeId);
  }

  download(exchangeId: string): Promise<ExchangeFileInput> {
    return this.downloadFromSession.execute(exchangeId);
  }

  history(exchangeId?: string | null): Promise<readonly ExchangeHistoryEntry[]> {
    return this.historyFromSession.execute(exchangeId ?? null);
  }

  deposit(input: {
    category: string;
    file: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot> {
    return this.depositFromSession.execute(input);
  }
}
