import {
  ActorContext,
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';

export interface IMarkCabinetExchangeToTransmit {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    exchangeId: string;
    category?: string | null;
    file?: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot>;
}

export const IMarkCabinetExchangeToTransmit = Symbol('IMarkCabinetExchangeToTransmit');
