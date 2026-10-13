import { AbsenceFact } from '@hexagonal-monorepo-template/domain';
import { IAbsenceFactSource } from '@hexagonal-monorepo-template/ports';

export class InMemoryAbsenceFactSource implements IAbsenceFactSource {
  constructor(private readonly facts: readonly AbsenceFact[] = []) {}

  async listForEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<readonly AbsenceFact[]> {
    return this.facts.filter(
      (fact) => fact.companyId === companyId && fact.employeeId === employeeId,
    );
  }
}
