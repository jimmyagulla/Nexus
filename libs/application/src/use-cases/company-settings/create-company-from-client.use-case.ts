import {
  CompanySettingsDto,
  CompanySettingsRepository,
} from '@hexagonal-monorepo-template/ports';

export class CreateCompanyFromClientUseCase {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(name: string): Promise<CompanySettingsDto> {
    return this.repository.create(name);
  }
}
