import {
  ActorContext,
  CabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IOpenCabinetExchange {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    exchangeId: string;
  }): Promise<CabinetExchangeSnapshot>;
}

export const IOpenCabinetExchange = Symbol('IOpenCabinetExchange');
