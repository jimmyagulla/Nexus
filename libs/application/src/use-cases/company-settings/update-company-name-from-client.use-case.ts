import {
  CompanySettingsDto,
  CompanySettingsRepository,
} from '@hexagonal-monorepo-template/ports';

export class UpdateCompanyNameFromClientUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(companyId: string, name: string): Promise<CompanySettingsDto> {
    return this.repository.updateName(companyId, name);
  }
}
