import {
  CalendarDate,
  PublicHoliday,
} from '@hexagonal-monorepo-template/domain';
import { IPublicHolidayRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';

export class PrismaPublicHolidayRepository implements IPublicHolidayRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async save(holiday: PublicHoliday): Promise<void> {
    await this.prisma.publicHoliday.upsert({
      where: { id: holiday.id },
      create: {
        id: holiday.id,
        date: holiday.date.value,
        label: holiday.label,
      },
      update: {
        date: holiday.date.value,
        label: holiday.label,
      },
    });
  }

  async findById(id: string): Promise<PublicHoliday | null> {
    const row = await this.prisma.publicHoliday.findUnique({ where: { id } });
    return row === null
      ? null
      : new PublicHoliday(row.id, CalendarDate.parse(row.date), row.label);
  }

  async findByDateAndLabel(
    date: CalendarDate,
    label: string,
  ): Promise<PublicHoliday | null> {
    const row = await this.prisma.publicHoliday.findUnique({
      where: { date_label: { date: date.value, label } },
    });
    return row === null
      ? null
      : new PublicHoliday(row.id, CalendarDate.parse(row.date), row.label);
  }
}
