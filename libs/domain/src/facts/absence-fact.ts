import { CalendarDate } from '../value-objects/calendar-date';

export type AbsenceFact = {
  id: string;
  companyId: string;
  employeeId: string;
  start: CalendarDate;
  end: CalendarDate;
  type: string;
  days: number;
  sourceRequestId: string;
};
