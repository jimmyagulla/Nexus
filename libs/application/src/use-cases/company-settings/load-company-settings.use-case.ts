import {
  CompanySettingsDto,
  CompanySettingsRepository,
} from '@hexagonal-monorepo-template/ports';

export class LoadCompanySettingsUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(companyId: string): Promise<CompanySettingsDto> {
    return this.repository.find(companyId);
  }
}
