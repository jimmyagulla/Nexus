import { OwnerScope, PersonalInfo } from '@hexagonal-monorepo-template/domain';
import { IPersonalInfoRepository } from '@hexagonal-monorepo-template/ports';

/** The personal information kept in the process, one per employee of a company. */
export class InMemoryPersonalInfoRepository implements IPersonalInfoRepository {
  private readonly infos = new Map<string, PersonalInfo>();

  constructor(infos: readonly PersonalInfo[] = []) {
    infos.forEach((info) => this.infos.set(this.keyOf(info.companyId, info.employeeId), info));
  }

  async findByEmployee(scope: OwnerScope): Promise<PersonalInfo | null> {
    return this.infos.get(this.keyOf(scope.companyId, scope.ownerId)) ?? null;
  }

  async save(info: PersonalInfo): Promise<void> {
    this.infos.set(this.keyOf(info.companyId, info.employeeId), info);
  }

  private keyOf(companyId: string, employeeId: string): string {
    return `${companyId}/${employeeId}`;
  }
}
