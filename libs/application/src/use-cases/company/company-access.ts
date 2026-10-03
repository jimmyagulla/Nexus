import {
  assertSameCompany,
  BusinessError,
  BusinessErrorCode,
  Company,
} from '@hexagonal-monorepo-template/domain';
import { ICompanyRepository } from '@hexagonal-monorepo-template/ports';

export async function requireAccessibleCompany(
  companyId: string,
  actorCompanyId: string,
  companies: ICompanyRepository,
): Promise<Company> {
  assertSameCompany(companyId, actorCompanyId);
  const company = await companies.findById(companyId);
  if (company === null) {
    throw new BusinessError(BusinessErrorCode.NON_AUTORISE);
  }
  return company;
}
