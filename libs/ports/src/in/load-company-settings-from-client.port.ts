import { CompanySettingsSnapshot } from './company-settings-snapshot';

export interface LoadCompanySettingsFromClientQuery {
  companyId: string;
}

export interface ILoadCompanySettingsFromClient {
  execute(
    query: LoadCompanySettingsFromClientQuery,
  ): Promise<CompanySettingsSnapshot>;
}

export const ILoadCompanySettingsFromClient = Symbol(
  'ILoadCompanySettingsFromClient',
);
