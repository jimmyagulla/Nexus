import { Company } from '@hexagonal-monorepo-template/domain';

export interface ICompanyRepository {
  save(company: Company): Promise<void>;
  findById(companyId: string): Promise<Company | null>;
}

export const ICompanyRepository = Symbol('ICompanyRepository');
