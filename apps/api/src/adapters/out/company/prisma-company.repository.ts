import {
  Company,
  Holiday,
  type Weekday,
} from '@hexagonal-monorepo-template/domain';
import { ICompanyRepository } from '@hexagonal-monorepo-template/ports';
import { Weekday as PrismaWeekday } from '../../../infrastructure/prisma/generated';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { fromPrismaWeekday, toPrismaWeekday } from '../weekday-prisma.mapper';

function toDomain(row: {
  id: string;
  name: string;
  nonWorkingWeekdays: { weekday: PrismaWeekday }[];
  holidays: { id: string; date: string; label: string }[];
}): Company {
  const weekdays: Weekday[] = row.nonWorkingWeekdays.map((entry) =>
    fromPrismaWeekday(entry.weekday),
  );
  return Company.restore({
    id: row.id,
    name: row.name,
    nonWorkingWeekdays: weekdays,
    holidays: row.holidays.map((holiday) =>
      Holiday.restore(holiday.id, holiday.date, holiday.label),
    ),
  });
}

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
