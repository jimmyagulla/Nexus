import { PublicHoliday } from './public-holiday';

export class CompanyPublicHoliday {
  constructor(
    readonly companyId: string,
    readonly publicHoliday: PublicHoliday,
  ) {}
}
