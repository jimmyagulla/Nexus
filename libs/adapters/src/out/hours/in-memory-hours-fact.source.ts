import { HoursFact } from '@hexagonal-monorepo-template/domain';
import { IHoursFactSource } from '@hexagonal-monorepo-template/ports';

export class InMemoryHoursFactSource implements IHoursFactSource {
  constructor(private readonly facts: readonly HoursFact[] = []) {}

  async listForEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<readonly HoursFact[]> {
    return this.facts.filter(
      (fact) => fact.companyId === companyId && fact.employeeId === employeeId,
    );
  }
}
