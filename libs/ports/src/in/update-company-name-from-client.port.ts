import { CompanySettingsSnapshot } from './company-settings-snapshot';

export interface UpdateCompanyNameFromClientCommand {
  companyId: string;
  name: string;
}

export interface IUpdateCompanyNameFromClient {
  execute(
    command: UpdateCompanyNameFromClientCommand,
  ): Promise<CompanySettingsSnapshot>;
}

export const IUpdateCompanyNameFromClient = Symbol(
  'IUpdateCompanyNameFromClient',
);
