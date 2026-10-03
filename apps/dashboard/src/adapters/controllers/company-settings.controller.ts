import { CompanySettingsDto } from '@hexagonal-monorepo-template/ports';
import { AddCompanyHolidayFromClientUseCase } from '../../application/company-settings/add-company-holiday-from-client.use-case';
import { CreateCompanyFromClientUseCase } from '../../application/company-settings/create-company-from-client.use-case';
import { LoadCompanySettingsUseCase } from '../../application/company-settings/load-company-settings.use-case';
import { RemoveCompanyHolidayFromClientUseCase } from '../../application/company-settings/remove-company-holiday-from-client.use-case';
import { UpdateCompanyNameFromClientUseCase } from '../../application/company-settings/update-company-name-from-client.use-case';
import { UpdateNonWorkingWeekdaysFromClientUseCase } from '../../application/company-settings/update-non-working-weekdays-from-client.use-case';

export class CompanySettingsController {
  constructor(
    private readonly loadSettings: LoadCompanySettingsUseCase,
    private readonly createCompany: CreateCompanyFromClientUseCase,
    private readonly updateName: UpdateCompanyNameFromClientUseCase,
    private readonly updateWeekdays: UpdateNonWorkingWeekdaysFromClientUseCase,
    private readonly addHoliday: AddCompanyHolidayFromClientUseCase,
    private readonly removeHoliday: RemoveCompanyHolidayFromClientUseCase,
  ) {}

  load(companyId: string): Promise<CompanySettingsDto> {
    return this.loadSettings.execute(companyId);
  }

  create(name: string): Promise<CompanySettingsDto> {
    return this.createCompany.execute(name);
  }

  rename(companyId: string, name: string): Promise<CompanySettingsDto> {
    return this.updateName.execute(companyId, name);
  }

  setWeekdays(companyId: string, weekdays: number[]): Promise<CompanySettingsDto> {
    return this.updateWeekdays.execute(companyId, weekdays);
  }

  addPublicHoliday(
    companyId: string,
    date: string,
    label: string,
  ): Promise<CompanySettingsDto> {
    return this.addHoliday.execute(companyId, date, label);
  }

  removePublicHoliday(
    companyId: string,
    holidayId: string,
  ): Promise<CompanySettingsDto> {
    return this.removeHoliday.execute(companyId, holidayId);
  }
}
