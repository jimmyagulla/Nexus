import { ExchangeHistoryEntry } from '@hexagonal-monorepo-template/domain';

export interface IListCabinetExchangeHistoryFromSession {
  execute(exchangeId?: string | null): Promise<readonly ExchangeHistoryEntry[]>;
}

export const IListCabinetExchangeHistoryFromSession = Symbol(
  'IListCabinetExchangeHistoryFromSession',
);
