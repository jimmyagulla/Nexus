import {
  CompanySettingsRepository,
  CompanySettingsSnapshot,
  CreateCompanyFromClientCommand,
  ICreateCompanyFromClient,
} from '@hexagonal-monorepo-template/ports';

export class CreateCompanyFromClientUseCase implements ICreateCompanyFromClient {
  constructor(private readonly repository: CompanySettingsRepository) {}

  execute(
    command: CreateCompanyFromClientCommand,
  ): Promise<CompanySettingsSnapshot> {
    return this.repository.create(command.name);
  }
}
