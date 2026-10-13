import {
  ActorContext,
  CabinetExchangeSnapshot,
  ExchangeFileInput,
} from '@hexagonal-monorepo-template/domain';

export interface ICreateCabinetExchangeDraft {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    category?: string | null;
    file?: ExchangeFileInput | null;
  }): Promise<CabinetExchangeSnapshot>;
}

export const ICreateCabinetExchangeDraft = Symbol('ICreateCabinetExchangeDraft');
