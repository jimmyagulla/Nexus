import { CompanySettingsSnapshot } from './company-settings-snapshot';

export interface UpdateNonWorkingWeekdaysFromClientCommand {
  companyId: string;
  weekdays: number[];
}

export interface IUpdateNonWorkingWeekdaysFromClient {
  execute(
    command: UpdateNonWorkingWeekdaysFromClientCommand,
  ): Promise<CompanySettingsSnapshot>;
}

export const IUpdateNonWorkingWeekdaysFromClient = Symbol(
  'IUpdateNonWorkingWeekdaysFromClient',
);
