import {
  Company,
  Holiday,
  isWeekday,
  type Weekday,
} from '@hexagonal-monorepo-template/domain';
import { ICompanyRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';

function parseWeekdays(raw: string): Weekday[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed.filter((value): value is Weekday => isWeekday(value));
}

function toDomain(row: {
  id: string;
  name: string;
  nonWorkingWeekdays: string;
  holidays: { id: string; date: string; label: string }[];
}): Company {
  return Company.restore({
    id: row.id,
    name: row.name,
    nonWorkingWeekdays: parseWeekdays(row.nonWorkingWeekdays),
    holidays: row.holidays.map((holiday) =>
      Holiday.restore(holiday.id, holiday.date, holiday.label),
    ),
  });
}

export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async save(company: Company): Promise<void> {
    await this.prisma.company.upsert({
      where: { id: company.id },
      create: {
        id: company.id,
        name: company.name,
        nonWorkingWeekdays: JSON.stringify(company.nonWorkingWeekdays),
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
        nonWorkingWeekdays: JSON.stringify(company.nonWorkingWeekdays),
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
      include: { holidays: true },
    });
    return row === null ? null : toDomain(row);
  }
}
