import {
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';

export interface IDepositCabinetExchangeFromSession {
  execute(input: {
    category: string;
    file: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot>;
}

export const IDepositCabinetExchangeFromSession = Symbol(
  'IDepositCabinetExchangeFromSession',
);
