import {
  CabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IListCabinetExchangesFromSession {
  execute(): Promise<readonly CabinetExchangeSnapshot[]>;
}

export const IListCabinetExchangesFromSession = Symbol('IListCabinetExchangesFromSession');
