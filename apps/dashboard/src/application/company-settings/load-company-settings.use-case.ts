import {
  CompanySettingsDto,
  CompanySettingsGateway,
} from '@hexagonal-monorepo-template/ports';

export class LoadCompanySettingsUseCase {
  constructor(private readonly gateway: CompanySettingsGateway) {}

  execute(companyId: string): Promise<CompanySettingsDto> {
    return this.gateway.find(companyId);
  }
}
