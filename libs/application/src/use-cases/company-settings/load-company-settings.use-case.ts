import {
  CompanySettingsRepository,
  CompanySettingsSnapshot,
  ILoadCompanySettingsFromClient,
  LoadCompanySettingsFromClientQuery,
} from '@hexagonal-monorepo-template/ports';

export class LoadCompanySettingsUseCase implements ILoadCompanySettingsFromClient {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(
    query: LoadCompanySettingsFromClientQuery,
  ): Promise<CompanySettingsSnapshot> {
    return this.repository.find(query.companyId);
  }
}
