import {
  CompanySettingsRepository,
  CompanySettingsSnapshot,
  IUpdateNonWorkingWeekdaysFromClient,
  UpdateNonWorkingWeekdaysFromClientCommand,
} from '@hexagonal-monorepo-template/ports';

export class UpdateNonWorkingWeekdaysFromClientUseCase
  implements IUpdateNonWorkingWeekdaysFromClient
{
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(
    command: UpdateNonWorkingWeekdaysFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.repository.updateNonWorkingWeekdays(
      command.companyId,
      command.weekdays,
    );
  }
}
