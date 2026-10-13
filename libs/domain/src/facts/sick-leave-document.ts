import { CalendarDate } from '../value-objects/calendar-date';

export type SickLeaveDocument = {
  id: string;
  companyId: string;
  employeeId: string;
  date: CalendarDate;
};
