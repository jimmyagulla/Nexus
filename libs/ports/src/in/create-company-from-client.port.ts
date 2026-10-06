import { CompanySettingsSnapshot } from './company-settings-snapshot';

export interface CreateCompanyFromClientCommand {
  name: string;
}

export interface ICreateCompanyFromClient {
  execute(
    command: CreateCompanyFromClientCommand,
  ): Promise<CompanySettingsSnapshot>;
}

export const ICreateCompanyFromClient = Symbol('ICreateCompanyFromClient');
