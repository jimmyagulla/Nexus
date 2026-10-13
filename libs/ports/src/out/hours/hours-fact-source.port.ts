import { HoursFact } from '@hexagonal-monorepo-template/domain';

export interface IHoursFactSource {
  listForEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<readonly HoursFact[]>;
  markProcessed(companyId: string, factIds: readonly string[]): Promise<void>;
}

export const IHoursFactSource = Symbol('IHoursFactSource');
