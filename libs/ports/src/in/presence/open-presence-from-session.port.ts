import { PresenceSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IOpenPresenceFromSession {
  execute(input: {
    employeeId: string;
    month: string;
  }): Promise<PresenceSnapshot>;
}

export const IOpenPresenceFromSession = Symbol('IOpenPresenceFromSession');
