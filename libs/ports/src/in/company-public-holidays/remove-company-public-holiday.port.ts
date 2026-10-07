import {
  ActorContext,
  CompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';

export interface IRemoveCompanyPublicHoliday {
  execute(input: {
    actor: ActorContext;
    companyId: string;
    publicHolidayId: string;
  }): Promise<CompanySettingsSnapshot>;
}

export const IRemoveCompanyPublicHoliday = Symbol(
  'IRemoveCompanyPublicHoliday',
);
