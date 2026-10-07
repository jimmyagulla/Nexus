import { DayOfWeek } from '../value-objects/day-of-week';

export type AuditSnapshot = {
  companyName?: string;
  daysOfWeek?: readonly DayOfWeek[];
  publicHolidayId?: string;
  holidayDate?: string;
  holidayLabel?: string;
};
