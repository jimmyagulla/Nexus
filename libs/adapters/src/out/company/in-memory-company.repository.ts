import { Company } from '@hexagonal-monorepo-template/domain';
import { ICompanyRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryCompanyRepository implements ICompanyRepository {
  private readonly store = new Map<string, Company>();

  async save(company: Company): Promise<void> {
    this.store.set(company.id, company);
  }

  async findById(companyId: string): Promise<Company | null> {
    return this.store.get(companyId) ?? null;
  }
}
