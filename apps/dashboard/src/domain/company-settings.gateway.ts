import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';

export interface ICompanySettingsGateway {
  create(name: string, token: string): Promise<CompanySettingsSnapshot>;
  get(companyId: string, token: string): Promise<CompanySettingsSnapshot>;
  rename(
    companyId: string,
    name: string,
    token: string,
  ): Promise<CompanySettingsSnapshot>;
  setNonWorkingWeekdays(
    companyId: string,
    weekdays: readonly string[],
    token: string,
  ): Promise<CompanySettingsSnapshot>;
  addPublicHoliday(
    companyId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot>;
  updatePublicHoliday(
    companyId: string,
    publicHolidayId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot>;
  removePublicHoliday(
    companyId: string,
    publicHolidayId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot>;
}
