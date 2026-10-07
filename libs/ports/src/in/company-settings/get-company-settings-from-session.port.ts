import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IGetCompanySettingsFromSession {
  execute(): Promise<CompanySettingsSnapshot>;
}

export const IGetCompanySettingsFromSession = Symbol(
  'IGetCompanySettingsFromSession',
);
