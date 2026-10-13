import {
  ActorContext,
  CabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface ITransmitCabinetExchanges {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    exchangeIds: readonly string[];
  }): Promise<readonly CabinetExchangeSnapshot[]>;
}

export const ITransmitCabinetExchanges = Symbol('ITransmitCabinetExchanges');
