import { Company, CompanyName } from '@hexagonal-monorepo-template/domain';

export interface ICompanyRepository {
  insert(name: CompanyName): Promise<Company>;
  save(company: Company): Promise<void>;
  findById(companyId: string): Promise<Company | null>;
}

export const ICompanyRepository = Symbol('ICompanyRepository');
