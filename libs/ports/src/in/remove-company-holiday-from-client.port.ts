import { CompanySettingsSnapshot } from './company-settings-snapshot';

export interface RemoveCompanyHolidayFromClientCommand {
  companyId: string;
  holidayId: string;
}

export interface IRemoveCompanyHolidayFromClient {
  execute(
    command: RemoveCompanyHolidayFromClientCommand,
  ): Promise<CompanySettingsSnapshot>;
}

export const IRemoveCompanyHolidayFromClient = Symbol(
  'IRemoveCompanyHolidayFromClient',
);
