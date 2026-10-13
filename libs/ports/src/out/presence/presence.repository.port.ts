import { Presence, PresenceMonth } from '@hexagonal-monorepo-template/domain';

export type NewPresence = {
  companyId: string;
  employeeId: string;
  month: PresenceMonth;
  workedDays: number;
};

export type PresenceFilter = {
  companyId: string;
};

export interface IPresenceRepository {
  insert(presence: NewPresence): Promise<Presence>;
  save(presence: Presence): Promise<void>;
  findById(companyId: string, presenceId: string): Promise<Presence | null>;
  findByEmployeeAndMonth(
    companyId: string,
    employeeId: string,
    month: PresenceMonth,
  ): Promise<Presence | null>;
  list(filter: PresenceFilter): Promise<readonly Presence[]>;
}

export const IPresenceRepository = Symbol('IPresenceRepository');
