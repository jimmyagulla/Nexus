import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';

export interface ICompanyPublicHolidaysGateway {
  add(
    companyId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot>;
  update(
    companyId: string,
    publicHolidayId: string,
    date: string,
    label: string,
    token: string,
  ): Promise<CompanySettingsSnapshot>;
  remove(
    companyId: string,
    publicHolidayId: string,
    token: string,
  ): Promise<CompanySettingsSnapshot>;
}

export const ICompanyPublicHolidaysGateway = Symbol(
  'ICompanyPublicHolidaysGateway',
);
