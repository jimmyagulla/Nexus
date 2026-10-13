import {
  ActorContext,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IOpenPresence {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    employeeId: string;
    month: string;
  }): Promise<PresenceSnapshot>;
}

export const IOpenPresence = Symbol('IOpenPresence');
