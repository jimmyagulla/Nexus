import { CompanySettingsSnapshot, DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { LoadCompanySettingsUseCase } from '../../application/load-company-settings.use-case';
import {
  AddCompanyPublicHolidayFromClientUseCase,
  RemoveCompanyPublicHolidayFromClientUseCase,
  RenameCompanyFromClientUseCase,
  SetNonWorkingWeekdaysFromClientUseCase,
} from '../../application/company-settings.use-cases';

export class CompanySettingsController {
  constructor(
    private readonly load: LoadCompanySettingsUseCase,
    private readonly rename: RenameCompanyFromClientUseCase,
    private readonly setWeekdays: SetNonWorkingWeekdaysFromClientUseCase,
    private readonly addHoliday: AddCompanyPublicHolidayFromClientUseCase,
    private readonly removeHoliday: RemoveCompanyPublicHolidayFromClientUseCase,
  ) {}

  getSettings(): Promise<CompanySettingsSnapshot> {
    return this.load.execute();
  }

  renameCompany(name: string): Promise<CompanySettingsSnapshot> {
    return this.rename.execute(name);
  }

  updateNonWorkingWeekdays(
    weekdays: readonly DayOfWeek[],
  ): Promise<CompanySettingsSnapshot> {
    return this.setWeekdays.execute(weekdays);
  }

  addPublicHoliday(input: {
    date: string;
    label: string;
  }): Promise<CompanySettingsSnapshot> {
    return this.addHoliday.execute(input);
  }

  removePublicHoliday(publicHolidayId: string): Promise<CompanySettingsSnapshot> {
    return this.removeHoliday.execute(publicHolidayId);
  }
}
