import { Company } from '@hexagonal-monorepo-template/domain';
import {
  ICompanyRepository,
  ICreateCompanyInboundPort,
} from '@hexagonal-monorepo-template/ports';

export class CreateCompanyUseCase implements ICreateCompanyInboundPort {
  constructor(private readonly companies: ICompanyRepository) {}

  async execute(name: string): Promise<Company> {
    const company = Company.create(name);
    await this.companies.save(company);
    return company;
  }
}
