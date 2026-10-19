import { OwnerScope, PersonalInfo } from '@hexagonal-monorepo-template/domain';
import { IPersonalInfoRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toPersonalInfo } from './prisma-personal-info.mapper';

export class PrismaPersonalInfoRepository implements IPersonalInfoRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async findByEmployee(scope: OwnerScope): Promise<PersonalInfo | null> {
    const row = await this.prisma.personalInfo.findUnique({
      where: { companyId_employeeId: { companyId: scope.companyId, employeeId: scope.ownerId } },
    });
    return row === null ? null : toPersonalInfo(row);
  }

  /** Only the contact details and the instant of the change ever change here. */
  async save(info: PersonalInfo): Promise<void> {
    await this.prisma.personalInfo.update({
      where: { companyId_employeeId: { companyId: info.companyId, employeeId: info.employeeId } },
      data: { ...info.contact.toValues(), updatedAt: info.updatedAt },
    });
  }
}
