import {
  CompanySettingsDto,
  CompanySettingsGateway,
} from '@hexagonal-monorepo-template/ports';

export class CreateCompanyFromClientUseCase {
  constructor(private readonly gateway: CompanySettingsGateway) {}

  execute(name: string): Promise<CompanySettingsDto> {
    return this.gateway.create(name);
  }
}
