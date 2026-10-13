import {
  ActorContext,
  CabinetExchangeSnapshot,
  ExchangeFilters,
} from '@hexagonal-monorepo-template/domain';

export interface IListCabinetExchanges {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    filters?: ExchangeFilters;
  }): Promise<readonly CabinetExchangeSnapshot[]>;
}

export const IListCabinetExchanges = Symbol('IListCabinetExchanges');
