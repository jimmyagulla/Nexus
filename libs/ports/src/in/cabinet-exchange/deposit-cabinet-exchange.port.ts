import {
  ActorContext,
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';

export interface IDepositCabinetExchange {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    category: string;
    file: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot>;
}

export const IDepositCabinetExchange = Symbol('IDepositCabinetExchange');
