import {
  ActorContext,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IAdjustPresenceWorkedDays {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    presenceId: string;
    workedDays: number;
  }): Promise<PresenceSnapshot>;
}

export const IAdjustPresenceWorkedDays = Symbol('IAdjustPresenceWorkedDays');
