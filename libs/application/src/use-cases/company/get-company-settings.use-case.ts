import { Company } from '@hexagonal-monorepo-template/domain';
import {
  GetCompanySettingsQuery,
  ICompanyRepository,
  IGetCompanySettingsInboundPort,
} from '@hexagonal-monorepo-template/ports';
import { requireAccessibleCompany } from './company-access';

export class GetCompanySettingsUseCase implements IGetCompanySettingsInboundPort {
  constructor(private readonly companies: ICompanyRepository) {}

  async execute(query: GetCompanySettingsQuery): Promise<Company> {
    return requireAccessibleCompany(
      query.companyId,
      query.actorCompanyId,
      this.companies,
    );
  }
}
