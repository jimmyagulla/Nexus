import {
  ActorContext,
  CompanySettingsSnapshot,
  requireAccessibleCompany,
  toCompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/domain';
import {
  ICompanyRepository,
  IGetCompanySettings,
} from '@hexagonal-monorepo-template/ports';

export class GetCompanySettingsUseCase implements IGetCompanySettings {
  constructor(private readonly companies: ICompanyRepository) {}

  async execute(input: {
    actor: ActorContext;
    companyId: string;
  }): Promise<CompanySettingsSnapshot> {
    const company = await requireAccessibleCompany(
      input.companyId,
      input.actor.companyId,
      (id) => this.companies.findById(id),
    );
    return toCompanySettingsSnapshot(company);
  }
}
