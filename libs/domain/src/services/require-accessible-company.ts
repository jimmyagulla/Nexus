import { Company } from '../entities/company';
import { ErrorCode } from '../errors/error-code';
import { assertSameCompany } from './tenant-access';

export async function requireAccessibleCompany(
  companyId: string,
  actorCompanyId: string | null,
  findById: (id: string) => Promise<Company | null>,
): Promise<Company> {
  assertSameCompany(companyId, actorCompanyId);
  const company = await findById(companyId);
  if (company === null) {
    throw new Error(ErrorCode.ACCESS_DENIED);
  }
  return company;
}
