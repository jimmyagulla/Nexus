import { CalendarDate } from '../value-objects/calendar-date';
import { HoursFactStatus } from './hours-fact-status';

export type HoursFact = {
  id: string;
  companyId: string;
  employeeId: string;
  date: CalendarDate;
  hours: number;
  sourceDeclarationId: string;
  status: HoursFactStatus;
};
