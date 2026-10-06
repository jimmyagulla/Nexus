import {
  ActorContext,
  CompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IRenameCompany {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    name: string;
  }): Promise<CompanySettingsSnapshot>;
}

export const IRenameCompany = Symbol('IRenameCompany');
