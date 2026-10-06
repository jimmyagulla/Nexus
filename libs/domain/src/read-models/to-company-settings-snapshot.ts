import { Company } from '../entities/company';
import { CompanySettingsSnapshot } from './company-settings-snapshot';

export function toCompanySettingsSnapshot(
  company: Company,
): CompanySettingsSnapshot {
  return {
    id: company.id,
    name: company.name.value,
    nonWorkingWeekdays: company.calendar.nonWorkingWeekdays,
    publicHolidays: company.calendar.publicHolidays.map((holiday) => ({
      id: holiday.publicHoliday.id,
      date: holiday.publicHoliday.date.value,
      label: holiday.publicHoliday.label,
    })),
  };
}
