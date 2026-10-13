import {
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';

export interface ICreateCabinetExchangeDraftFromSession {
  execute(input: {
    category?: string | null;
    file?: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot>;
}

export const ICreateCabinetExchangeDraftFromSession = Symbol('ICreateCabinetExchangeDraftFromSession');
