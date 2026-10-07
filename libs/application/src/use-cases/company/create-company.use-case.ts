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
  IIdGenerator,
} from '@hexagonal-monorepo-template/ports';

export class CreateCompanyUseCase implements ICreateCompany {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly ids: IIdGenerator,
    private readonly identity: ICompanyIdentityBinder,
  ) {}

  async execute(input: {
    actor: ActorContext;
    name: string;
  }): Promise<Company> {
    assertCompanyCreationAllowed(input.actor);
    const company = Company.create(
      this.ids.next(),
      CompanyName.parse(input.name),
    );
    await this.companies.save(company);
    await this.identity.bindEmployer(input.actor.userId, company.id);
    return company;
  }
}
