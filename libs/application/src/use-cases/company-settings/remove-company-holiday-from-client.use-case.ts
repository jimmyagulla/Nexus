import {
  CompanySettingsRepository,
  CompanySettingsSnapshot,
  IRemoveCompanyHolidayFromClient,
  RemoveCompanyHolidayFromClientCommand,
} from '@hexagonal-monorepo-template/ports';

export class RemoveCompanyHolidayFromClientUseCase
  implements IRemoveCompanyHolidayFromClient
{
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(
    command: RemoveCompanyHolidayFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.repository.removeHoliday(command.companyId, command.holidayId);
  }
}
