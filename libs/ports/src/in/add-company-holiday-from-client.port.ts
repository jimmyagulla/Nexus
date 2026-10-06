import { CompanySettingsSnapshot } from './company-settings-snapshot';

export interface AddCompanyHolidayFromClientCommand {
  companyId: string;
  date: string;
  label: string;
}

export interface IAddCompanyHolidayFromClient {
  execute(
    command: AddCompanyHolidayFromClientCommand,
  ): Promise<CompanySettingsSnapshot>;
}

export const IAddCompanyHolidayFromClient = Symbol(
  'IAddCompanyHolidayFromClient',
);
