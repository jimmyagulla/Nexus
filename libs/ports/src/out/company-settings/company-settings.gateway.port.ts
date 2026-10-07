import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';

export interface ICompanySettingsGateway {
  get(companyId: string, token: string): Promise<CompanySettingsSnapshot>;
  rename(
    companyId: string,
    name: string,
    token: string,
  ): Promise<CompanySettingsSnapshot>;
  setNonWorkingWeekdays(
    companyId: string,
    weekdays: readonly DayOfWeek[],
    token: string,
  ): Promise<CompanySettingsSnapshot>;
}

export const ICompanySettingsGateway = Symbol('ICompanySettingsGateway');
