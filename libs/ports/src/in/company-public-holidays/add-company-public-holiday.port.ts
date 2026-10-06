import {
  ActorContext,
  CompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IAddCompanyPublicHoliday {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    date: string;
    label: string;
  }): Promise<CompanySettingsSnapshot>;
}

export const IAddCompanyPublicHoliday = Symbol('IAddCompanyPublicHoliday');
