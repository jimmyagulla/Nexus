import { DayOfWeek } from '../value-objects/day-of-week';

export type CompanySettingsSnapshot = {
  id: string;
  name: string;
  nonWorkingWeekdays: readonly DayOfWeek[];
  publicHolidays: readonly {
    id: string;
    date: string;
    label: string;
  }[];
};
