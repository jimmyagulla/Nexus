import {
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';

export interface IMarkCabinetExchangeToTransmitFromSession {
  execute(input: {
    exchangeId: string;
    category?: string | null;
    file?: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot>;
}

export const IMarkCabinetExchangeToTransmitFromSession = Symbol('IMarkCabinetExchangeToTransmitFromSession');
