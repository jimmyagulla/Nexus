import { ErrorCode } from '../errors/error-code';
import { DayOfWeek } from '../value-objects/day-of-week';
import { CompanyPublicHoliday } from './company-public-holiday';

export class CompanyCalendar {
  constructor(
    readonly nonWorkingWeekdays: readonly DayOfWeek[],
    readonly publicHolidays: readonly CompanyPublicHoliday[],
  ) {}

  static default(): CompanyCalendar {
    return new CompanyCalendar([DayOfWeek.SATURDAY, DayOfWeek.SUNDAY], []);
  }

  withNonWorkingWeekdays(days: readonly DayOfWeek[]): CompanyCalendar {
    return new CompanyCalendar([...new Set(days)], this.publicHolidays);
  }

  addPublicHoliday(holiday: CompanyPublicHoliday): CompanyCalendar {
    if (
      this.publicHolidays.some((current) =>
        current.publicHoliday.date.equals(holiday.publicHoliday.date),
      )
    ) {
      throw new Error(ErrorCode.POTENTIAL_DUPLICATE);
    }

    return new CompanyCalendar(this.nonWorkingWeekdays, [
      ...this.publicHolidays,
      holiday,
    ]);
  }

  removePublicHoliday(publicHolidayId: string): CompanyCalendar {
    return new CompanyCalendar(
      this.nonWorkingWeekdays,
      this.publicHolidays.filter(
        (holiday) => holiday.publicHoliday.id !== publicHolidayId,
      ),
    );
  }

  replacePublicHoliday(
    publicHolidayId: string,
    next: CompanyPublicHoliday,
  ): CompanyCalendar {
    return this.removePublicHoliday(publicHolidayId).addPublicHoliday(next);
  }
}
