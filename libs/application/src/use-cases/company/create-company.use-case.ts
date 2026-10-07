import {
  ActorContext,
  assertCompanyCreationAllowed,
  Company,
  CompanyName,
} from '@hexagonal-monorepo-template/domain';
import {
  ICompanyIdentityBinder,
  ICompanyRepository,
  ICreateCompany,
} from '@hexagonal-monorepo-template/ports';

export class CreateCompanyUseCase implements ICreateCompany {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly identity: ICompanyIdentityBinder,
  ) {}

  async execute(input: {
    actor: ActorContext;
    name: string;
  }): Promise<Company> {
    assertCompanyCreationAllowed(input.actor);
    const company = await this.companies.insert(CompanyName.parse(input.name));
    await this.identity.bindEmployer(input.actor.userId, company.id);
    return company;
  }
}
