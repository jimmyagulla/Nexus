import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IRenameCompanyFromSession {
  execute(name: string): Promise<CompanySettingsSnapshot>;
}

export const IRenameCompanyFromSession = Symbol('IRenameCompanyFromSession');
