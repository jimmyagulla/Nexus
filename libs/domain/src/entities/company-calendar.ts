import { BusinessError } from '../errors/business-error';
import { BusinessErrorCode } from '../errors/business-error-codes';
import { type Weekday } from '../value-objects/weekday';
import { Company } from './company';
import { Holiday } from './holiday';

export class CompanyCalendar {
  static addHoliday(company: Company, date: string, label: string): Company {
    const trimmed = label.trim();
    if (trimmed.length === 0) {
      throw new BusinessError(BusinessErrorCode.INFORMATION_OBLIGATOIRE);
    }
    return company.withHolidays([...company.holidays, Holiday.create(date, trimmed)]);
  }

  static updateHoliday(
    company: Company,
    holidayId: string,
    date: string,
    label: string,
  ): Company {
    const trimmed = label.trim();
    if (trimmed.length === 0) {
      throw new BusinessError(BusinessErrorCode.INFORMATION_OBLIGATOIRE);
    }
    const holidays = company.holidays.map((holiday) =>
      holiday.id === holidayId ? holiday.update(date, trimmed) : holiday,
    );
    return company.withHolidays(holidays);
  }

  static removeHoliday(company: Company, holidayId: string): Company {
    return company.withHolidays(
      company.holidays.filter((holiday) => holiday.id !== holidayId),
    );
  }

  static setNonWorkingWeekdays(
    company: Company,
    weekdays: readonly Weekday[],
  ): Company {
    return company.withNonWorkingWeekdays(weekdays);
  }
}
