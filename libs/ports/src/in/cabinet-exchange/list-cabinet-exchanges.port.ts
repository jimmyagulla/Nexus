import {
  ActorContext,
  CabinetExchangeSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IListCabinetExchanges {
  execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<readonly CabinetExchangeSnapshot[]>;
}

export const IListCabinetExchanges = Symbol('IListCabinetExchanges');
