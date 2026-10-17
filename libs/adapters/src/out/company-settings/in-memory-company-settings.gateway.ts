import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { ICompanySettingsGateway } from '@hexagonal-monorepo-template/ports';

/**
 * The company settings of the API, kept in the process. The token is trusted
 * as the API would after checking it. Share the map with an
 * InMemoryCompanyPublicHolidaysGateway to serve one consistent company.
 */
export class InMemoryCompanySettingsGateway implements ICompanySettingsGateway {
  constructor(
    private readonly companies = new Map<string, CompanySettingsSnapshot>(),
  ) {}

  async get(companyId: string): Promise<CompanySettingsSnapshot> {
    return this.find(companyId);
  }

  async rename(
    companyId: string,
    name: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.store({ ...this.find(companyId), name });
  }

  async setNonWorkingWeekdays(
    companyId: string,
    weekdays: readonly DayOfWeek[],
  ): Promise<CompanySettingsSnapshot> {
    return this.store({
      ...this.find(companyId),
      nonWorkingWeekdays: [...weekdays],
    });
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
