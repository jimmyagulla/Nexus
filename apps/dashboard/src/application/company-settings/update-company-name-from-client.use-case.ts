import {
  CompanySettingsDto,
  CompanySettingsGateway,
} from '@hexagonal-monorepo-template/ports';

export class UpdateCompanyNameFromClientUseCase {
  constructor(private readonly gateway: CompanySettingsGateway) {}

  execute(companyId: string, name: string): Promise<CompanySettingsDto> {
    return this.gateway.updateName(companyId, name);
  }
}
