import {
  ActorContext,
  ExchangeHistoryEntry,
} from '@hexagonal-monorepo-template/domain';

export interface IListCabinetExchangeHistory {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    exchangeId?: string | null;
  }): Promise<readonly ExchangeHistoryEntry[]>;
}

export const IListCabinetExchangeHistory = Symbol(
  'IListCabinetExchangeHistory',
);
