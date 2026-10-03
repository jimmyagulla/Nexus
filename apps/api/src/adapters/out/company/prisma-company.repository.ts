import { Company } from '@hexagonal-monorepo-template/domain';
import { ICompanyRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toPrismaWeekday } from '../weekday-prisma.mapper';
import { toDomain } from './prisma-company.mapper';

export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async save(company: Company): Promise<void> {
    const weekdays = company.nonWorkingWeekdays.map((weekday) => ({
      weekday: toPrismaWeekday(weekday),
    }));
    await this.prisma.company.upsert({
      where: { id: company.id },
      create: {
        id: company.id,
        name: company.name,
        nonWorkingWeekdays: { create: weekdays },
        holidays: {
          create: company.holidays.map((holiday) => ({
            id: holiday.id,
            date: holiday.date,
            label: holiday.label,
          })),
        },
      },
      update: {
        name: company.name,
        nonWorkingWeekdays: {
          deleteMany: {},
          create: weekdays,
        },
        holidays: {
          deleteMany: {},
          create: company.holidays.map((holiday) => ({
            id: holiday.id,
            date: holiday.date,
            label: holiday.label,
          })),
        },
      },
    });
  }

  async findById(companyId: string): Promise<Company | null> {
    const row = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { holidays: true, nonWorkingWeekdays: true },
    });
    return row === null ? null : toDomain(row);
  }
}
