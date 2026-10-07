import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IAddCompanyPublicHolidayFromSession {
  execute(input: {
    date: string;
    label: string;
  }): Promise<CompanySettingsSnapshot>;
}

export const IAddCompanyPublicHolidayFromSession = Symbol(
  'IAddCompanyPublicHolidayFromSession',
);
