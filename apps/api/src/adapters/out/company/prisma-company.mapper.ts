import {
  CalendarDate,
  Company,
  CompanyCalendar,
  CompanyName,
  CompanyPublicHoliday,
  DayOfWeek,
  PublicHoliday,
} from '@hexagonal-monorepo-template/domain';

export type PrismaCompanyRow = {
  id: string;
  name: string;
  nonWorkingWeekdays: { dayOfWeek: DayOfWeek }[];
  publicHolidays: {
    publicHoliday: { id: string; date: string; label: string };
  }[];
};

export function toCompany(row: PrismaCompanyRow): Company {
  return new Company(
    row.id,
    CompanyName.parse(row.name),
    new CompanyCalendar(
      row.nonWorkingWeekdays.map((item) => item.dayOfWeek),
      row.publicHolidays.map(
        (item) =>
          new CompanyPublicHoliday(
            row.id,
            new PublicHoliday(
              item.publicHoliday.id,
              CalendarDate.parse(item.publicHoliday.date),
              item.publicHoliday.label,
            ),
          ),
      ),
    ),
  );
}
