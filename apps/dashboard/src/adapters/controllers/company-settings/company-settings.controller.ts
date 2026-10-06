import {
  AddCompanyHolidayFromClientCommand,
  CreateCompanyFromClientCommand,
  IAddCompanyHolidayFromClient,
  ICreateCompanyFromClient,
  ILoadCompanySettingsFromClient,
  IRemoveCompanyHolidayFromClient,
  IUpdateCompanyNameFromClient,
  IUpdateNonWorkingWeekdaysFromClient,
  LoadCompanySettingsFromClientQuery,
  RemoveCompanyHolidayFromClientCommand,
  UpdateCompanyNameFromClientCommand,
  UpdateNonWorkingWeekdaysFromClientCommand,
  CompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/ports';

export class CompanySettingsController {
  constructor(
    private readonly loadSettings: ILoadCompanySettingsFromClient,
    private readonly createCompany: ICreateCompanyFromClient,
    private readonly updateName: IUpdateCompanyNameFromClient,
    private readonly updateWeekdays: IUpdateNonWorkingWeekdaysFromClient,
    private readonly addHoliday: IAddCompanyHolidayFromClient,
    private readonly removeHoliday: IRemoveCompanyHolidayFromClient,
  ) {}

  load(
    query: LoadCompanySettingsFromClientQuery,
  ): Promise<CompanySettingsSnapshot> {
    return this.loadSettings.execute(query);
  }

  create(
    command: CreateCompanyFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.createCompany.execute(command);
  }

  rename(
    command: UpdateCompanyNameFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.updateName.execute(command);
  }

  setWeekdays(
    command: UpdateNonWorkingWeekdaysFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.updateWeekdays.execute(command);
  }

  addPublicHoliday(
    command: AddCompanyHolidayFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.addHoliday.execute(command);
  }

  removePublicHoliday(
    command: RemoveCompanyHolidayFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.removeHoliday.execute(command);
  }
}
