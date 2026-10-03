import {
  Company,
  Holiday,
  type Weekday,
} from '@hexagonal-monorepo-template/domain';
import { Prisma } from '../../../infrastructure/prisma/prisma-client';
import { fromPrismaWeekday } from '../weekday-prisma.mapper';

export function toDomain(
  row: Prisma.CompanyGetPayload<{
    include: { holidays: true; nonWorkingWeekdays: true };
  }>,
): Company {
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
