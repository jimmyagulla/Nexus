import {
  AddCompanyHolidayFromClientCommand,
  CompanySettingsRepository,
  CompanySettingsSnapshot,
  IAddCompanyHolidayFromClient,
} from '@hexagonal-monorepo-template/ports';

export class AddCompanyHolidayFromClientUseCase
  implements IAddCompanyHolidayFromClient
{
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(
    command: AddCompanyHolidayFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.repository.addHoliday(
      command.companyId,
      command.date,
      command.label,
    );
  }
}
