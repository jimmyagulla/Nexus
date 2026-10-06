import { CalendarDate } from '../value-objects/calendar-date';

export class PublicHoliday {
  constructor(
    readonly id: string,
    readonly date: CalendarDate,
    readonly label: string,
  ) {}
}
