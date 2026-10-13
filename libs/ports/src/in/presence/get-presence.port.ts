import {
  ActorContext,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IGetPresence {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    presenceId: string;
  }): Promise<PresenceSnapshot>;
}

export const IGetPresence = Symbol('IGetPresence');
