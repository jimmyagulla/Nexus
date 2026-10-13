import {
  ActorContext,
  PresenceListSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IListPresences {
  execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<PresenceListSnapshot>;
}

export const IListPresences = Symbol('IListPresences');
