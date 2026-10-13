import {
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';

export interface ICabinetExchangeGateway {
  createDraft(
    companyId: string,
    input: { category?: string | null; file?: ExchangeFileInput | null },
    token: string,
  ): Promise<CabinetExchangeSnapshot>;
  markToTransmit(
    companyId: string,
    exchangeId: string,
    input: { category?: string | null; file?: ExchangeFileInput | null },
    token: string,
  ): Promise<CabinetExchangeSnapshot>;
  transmit(
    companyId: string,
    exchangeIds: readonly string[],
    token: string,
  ): Promise<readonly CabinetExchangeSnapshot[]>;
  list(
    companyId: string,
    token: string,
  ): Promise<readonly CabinetExchangeSnapshot[]>;
  open(
    companyId: string,
    exchangeId: string,
    token: string,
  ): Promise<CabinetExchangeSnapshot>;
  download(
    companyId: string,
    exchangeId: string,
    token: string,
  ): Promise<ExchangeFileInput>;
}

export const ICabinetExchangeGateway = Symbol('ICabinetExchangeGateway');
