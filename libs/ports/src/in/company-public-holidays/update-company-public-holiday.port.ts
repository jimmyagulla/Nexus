import {
  ActorContext,
  CompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IUpdateCompanyPublicHoliday {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    publicHolidayId: string;
    date: string;
    label: string;
  }): Promise<CompanySettingsSnapshot>;
}

export const IUpdateCompanyPublicHoliday = Symbol(
  'IUpdateCompanyPublicHoliday',
);
