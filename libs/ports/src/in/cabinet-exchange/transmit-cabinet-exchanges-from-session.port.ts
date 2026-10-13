import {
  CabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface ITransmitCabinetExchangesFromSession {
  execute(exchangeIds: readonly string[]): Promise<readonly CabinetExchangeSnapshot[]>;
}

export const ITransmitCabinetExchangesFromSession = Symbol('ITransmitCabinetExchangesFromSession');
