import {
  CompanySettingsRepository,
  CompanySettingsSnapshot,
  IUpdateCompanyNameFromClient,
  UpdateCompanyNameFromClientCommand,
} from '@hexagonal-monorepo-template/ports';

export class UpdateCompanyNameFromClientUseCase
  implements IUpdateCompanyNameFromClient
{
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(
    command: UpdateCompanyNameFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.repository.updateName(command.companyId, command.name);
  }
}
