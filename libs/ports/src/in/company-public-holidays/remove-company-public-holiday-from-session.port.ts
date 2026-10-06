import { CompanySettingsSnapshot } from '@hexagonal-monorepo-template/domain';

export interface IRemoveCompanyPublicHolidayFromSession {
  execute(publicHolidayId: string): Promise<CompanySettingsSnapshot>;
}

export const IRemoveCompanyPublicHolidayFromSession = Symbol(
  'IRemoveCompanyPublicHolidayFromSession',
);
