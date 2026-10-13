import { PresenceSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IAdjustPresenceWorkedDaysFromSession {
  execute(input: {
    presenceId: string;
    workedDays: number;
  }): Promise<PresenceSnapshot>;
}

export const IAdjustPresenceWorkedDaysFromSession = Symbol(
  'IAdjustPresenceWorkedDaysFromSession',
);
