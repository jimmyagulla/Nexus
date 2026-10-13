import { CabinetExchangeSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IOpenCabinetExchangeFromSession {
  execute(exchangeId: string): Promise<CabinetExchangeSnapshot>;
}

export const IOpenCabinetExchangeFromSession = Symbol(
  'IOpenCabinetExchangeFromSession',
);
