import { Company } from '@hexagonal-monorepo-template/domain';
import { ICompanyRepository } from '@hexagonal-monorepo-template/ports';
import { Prisma } from '../../../infrastructure/prisma/prisma-client';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toCompany } from './prisma-company.mapper';

const companyInclude = {
  nonWorkingWeekdays: true,
  publicHolidays: { include: { publicHoliday: true } },
} as const;

export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async save(company: Company): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.upsertIdentity(tx, company);
      await this.replaceNonWorkingWeekdays(tx, company);
      await this.replacePublicHolidays(tx, company);
    });
  }

  async findById(companyId: string): Promise<Company | null> {
    const row = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: companyInclude,
    });
    return row === null ? null : toCompany(row);
  }

  private async upsertIdentity(
    tx: Prisma.TransactionClient,
    company: Company,
  ): Promise<void> {
    await tx.company.upsert({
      where: { id: company.id },
      create: { id: company.id, name: company.name.value },
      update: { name: company.name.value },
    });
  }

  private async replaceNonWorkingWeekdays(
    tx: Prisma.TransactionClient,
    company: Company,
  ): Promise<void> {
    await tx.companyNonWorkingWeekday.deleteMany({
      where: { companyId: company.id },
    });
    if (company.calendar.nonWorkingWeekdays.length === 0) {
      return;
    }

    await tx.companyNonWorkingWeekday.createMany({
      data: company.calendar.nonWorkingWeekdays.map((dayOfWeek) => ({
        companyId: company.id,
        dayOfWeek,
      })),
    });
  }

  private async replacePublicHolidays(
    tx: Prisma.TransactionClient,
    company: Company,
  ): Promise<void> {
    await tx.companyPublicHoliday.deleteMany({
      where: { companyId: company.id },
    });
    if (company.calendar.publicHolidays.length === 0) {
      return;
    }

    await tx.companyPublicHoliday.createMany({
      data: company.calendar.publicHolidays.map((holiday) => ({
        companyId: company.id,
        publicHolidayId: holiday.publicHoliday.id,
      })),
    });
  }
}
