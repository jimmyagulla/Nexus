import {
  CabinetExchangeSnapshot,
  ExchangeFilters,
} from '@hexagonal-monorepo-template/domain';

export interface IListCabinetExchangesFromSession {
  execute(filters?: ExchangeFilters): Promise<readonly CabinetExchangeSnapshot[]>;
}

export const IListCabinetExchangesFromSession = Symbol('IListCabinetExchangesFromSession');
