import { Company, CompanyName } from '@hexagonal-monorepo-template/domain';
import {
  ICompanyRepository,
  IIdGenerator,
} from '@hexagonal-monorepo-template/ports';

export class InMemoryCompanyRepository implements ICompanyRepository {
  constructor(
    private readonly ids: IIdGenerator,
    private readonly companies = new Map<string, Company>(),
  ) {}

  async insert(name: CompanyName): Promise<Company> {
    const company = Company.create(this.ids.next(), name);
    this.companies.set(company.id, company);
    return company;
  }

  async save(company: Company): Promise<void> {
    this.companies.set(company.id, company);
  }

  async findById(companyId: string): Promise<Company | null> {
    return this.companies.get(companyId) ?? null;
  }
}
