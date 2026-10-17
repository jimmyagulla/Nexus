import {
  CompanySettingsSnapshot,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import {
  ICompanyPublicHolidaysGateway,
  IIdGenerator,
} from '@hexagonal-monorepo-template/ports';

/**
 * The public holidays of the API, kept in the process. The token is trusted
 * as the API would after checking it. Share the map with an
 * InMemoryCompanySettingsGateway to serve one consistent company.
 */
export class InMemoryCompanyPublicHolidaysGateway
  implements ICompanyPublicHolidaysGateway
{
  constructor(
    private readonly ids: IIdGenerator,
    private readonly companies = new Map<string, CompanySettingsSnapshot>(),
  ) {}

  async add(
    companyId: string,
    date: string,
    label: string,
  ): Promise<CompanySettingsSnapshot> {
    const company = this.find(companyId);
    return this.store({
      ...company,
      publicHolidays: [
        ...company.publicHolidays,
        { id: this.ids.next(), date, label },
      ],
    });
  }

  async update(
    companyId: string,
    publicHolidayId: string,
    date: string,
    label: string,
  ): Promise<CompanySettingsSnapshot> {
    const company = this.withHoliday(companyId, publicHolidayId);
    return this.store({
      ...company,
      publicHolidays: company.publicHolidays.map((holiday) =>
        holiday.id === publicHolidayId ? { id: holiday.id, date, label } : holiday,
      ),
    });
  }

  async remove(
    companyId: string,
    publicHolidayId: string,
  ): Promise<CompanySettingsSnapshot> {
    const company = this.withHoliday(companyId, publicHolidayId);
    return this.store({
      ...company,
      publicHolidays: company.publicHolidays.filter(
        (holiday) => holiday.id !== publicHolidayId,
      ),
    });
  }

  private withHoliday(
    companyId: string,
    publicHolidayId: string,
  ): CompanySettingsSnapshot {
    const company = this.find(companyId);
    if (!company.publicHolidays.some((holiday) => holiday.id === publicHolidayId)) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return company;
  }

  private find(companyId: string): CompanySettingsSnapshot {
    const company = this.companies.get(companyId);
    if (company === undefined) {
      throw new Error(ErrorCode.ACCESS_DENIED);
    }
    return company;
  }

  private store(company: CompanySettingsSnapshot): CompanySettingsSnapshot {
    this.companies.set(company.id, company);
    return company;
  }
}
