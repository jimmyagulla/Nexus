import {
  ActorContext,
  PresenceListSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IListPresences {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    employeeId?: string;
    from?: string;
    to?: string;
  }): Promise<PresenceListSnapshot>;
}

export const IListPresences = Symbol('IListPresences');
