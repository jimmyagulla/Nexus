import { DayOfWeek } from '../value-objects/day-of-week';

export class CompanyNonWorkingWeekday {
  constructor(
    readonly companyId: string,
    readonly dayOfWeek: DayOfWeek,
  ) {}
}
