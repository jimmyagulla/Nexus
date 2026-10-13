import {
  PresenceListSnapshot,
  PresenceSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IPresenceGateway {
  list(companyId: string, token: string): Promise<PresenceListSnapshot>;
  open(
    companyId: string,
    employeeId: string,
    month: string,
    token: string,
  ): Promise<PresenceSnapshot>;
  adjustWorkedDays(
    companyId: string,
    presenceId: string,
    workedDays: number,
    token: string,
  ): Promise<PresenceSnapshot>;
}

export const IPresenceGateway = Symbol('IPresenceGateway');
