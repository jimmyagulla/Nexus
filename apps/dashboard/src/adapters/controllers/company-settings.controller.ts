import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import {
  IAddCompanyPublicHolidayFromSession,
  IGetCompanySettingsFromSession,
  IRemoveCompanyPublicHolidayFromSession,
  IRenameCompanyFromSession,
  ISetNonWorkingWeekdaysFromSession,
} from '@hexagonal-monorepo-template/ports';

export class CompanySettingsController {
  constructor(
    private readonly getSettingsFromSession: IGetCompanySettingsFromSession,
    private readonly renameFromSession: IRenameCompanyFromSession,
    private readonly setWeekdaysFromSession: ISetNonWorkingWeekdaysFromSession,
    private readonly addHolidayFromSession: IAddCompanyPublicHolidayFromSession,
    private readonly removeHolidayFromSession: IRemoveCompanyPublicHolidayFromSession,
  ) {}

  getSettings(): Promise<CompanySettingsSnapshot> {
    return this.getSettingsFromSession.execute();
  }

  renameCompany(name: string): Promise<CompanySettingsSnapshot> {
    return this.renameFromSession.execute(name);
  }

  updateNonWorkingWeekdays(
    weekdays: readonly DayOfWeek[],
  ): Promise<CompanySettingsSnapshot> {
    return this.setWeekdaysFromSession.execute(weekdays);
  }

  addPublicHoliday(input: {
    date: string;
    label: string;
  }): Promise<CompanySettingsSnapshot> {
    return this.addHolidayFromSession.execute(input);
  }

  removePublicHoliday(
    publicHolidayId: string,
  ): Promise<CompanySettingsSnapshot> {
    return this.removeHolidayFromSession.execute(publicHolidayId);
  }
}
