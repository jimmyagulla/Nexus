import { HoursFact, HoursFactStatus } from '@hexagonal-monorepo-template/domain';
import { IHoursFactSource } from '@hexagonal-monorepo-template/ports';

export class InMemoryHoursFactSource implements IHoursFactSource {
  private facts: readonly HoursFact[];

  constructor(facts: readonly HoursFact[] = []) {
    this.facts = [...facts];
  }

  async listForEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<readonly HoursFact[]> {
    return this.facts.filter(
      (fact) => fact.companyId === companyId && fact.employeeId === employeeId,
    );
  }

  async markProcessed(
    companyId: string,
    factIds: readonly string[],
  ): Promise<void> {
    this.facts = this.facts.map((fact) =>
      fact.companyId === companyId && factIds.includes(fact.id)
        ? { ...fact, status: HoursFactStatus.PROCESSED }
        : fact,
    );
  }
}
