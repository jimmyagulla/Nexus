import { AbsenceFact } from '@hexagonal-monorepo-template/domain';

export interface IAbsenceFactSource {
  listForEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<readonly AbsenceFact[]>;
}

export const IAbsenceFactSource = Symbol('IAbsenceFactSource');
