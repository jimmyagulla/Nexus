import {
  Account,
  AccountIdentifier,
  ActorContext,
  assertCompanyCreationAllowed,
  Company,
  CompanyName,
} from '@hexagonal-monorepo-template/domain';
import {
  IAccountRepository,
  ICompanyIdentityBinder,
  ICompanyRepository,
  ICreateCompany,
} from '@hexagonal-monorepo-template/ports';

export class CreateCompanyUseCase implements ICreateCompany {
  constructor(
    private readonly companies: ICompanyRepository,
    private readonly identity: ICompanyIdentityBinder,
    private readonly accounts: IAccountRepository,
  ) {}

  async execute(input: {
    actor: ActorContext;
    name: string;
  }): Promise<Company> {
    assertCompanyCreationAllowed(input.actor);
    const identifier = AccountIdentifier.parse(input.actor.userId);
    const company = await this.companies.insert(CompanyName.parse(input.name));
    await this.accounts.insert(
      Account.inviteEmployer(
        globalThis.crypto.randomUUID(),
        company.id,
        identifier,
      ),
    );
    await this.identity.bindEmployer(input.actor.userId, company.id);
    return company;
  }
}
