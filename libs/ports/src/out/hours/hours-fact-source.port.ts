import { HoursFact } from '@hexagonal-monorepo-template/domain';

export interface IHoursFactSource {
  listForEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<readonly HoursFact[]>;
}

export const IHoursFactSource = Symbol('IHoursFactSource');
