import { ExchangeFile } from '@hexagonal-monorepo-template/domain';

export interface IExchangeFileStorage {
  save(exchangeId: string, file: ExchangeFile): Promise<void>;
  find(exchangeId: string): Promise<ExchangeFile | null>;
}

export const IExchangeFileStorage = Symbol('IExchangeFileStorage');
