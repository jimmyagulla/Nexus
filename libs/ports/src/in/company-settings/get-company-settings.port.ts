import {
  ActorContext,
  CompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IGetCompanySettings {
  execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<CompanySettingsSnapshot>;
}

export const IGetCompanySettings = Symbol('IGetCompanySettings');
