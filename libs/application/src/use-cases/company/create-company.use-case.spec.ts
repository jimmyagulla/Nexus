import {
  InMemoryAccountRepository,
  InMemoryCompanyIdentityBinder,
  InMemoryCompanyRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
  AccountStatus,
  ActorContext,
  Company,
  ErrorCode,
  UserRole,
} from '@hexagonal-monorepo-template/domain';
import { CreateCompanyUseCase } from './create-company.use-case';

const founder: ActorContext = {
  userId: 'user-1',
  companyId: null,
  role: null,
};

describe('CreateCompanyUseCase', () => {
  it('rejects an empty company name', async () => {
    const companies = new InMemoryCompanyRepository();
    const identity = new InMemoryCompanyIdentityBinder();
    const accounts = new InMemoryAccountRepository();
    const useCase = new CreateCompanyUseCase(
      companies,
      identity,
      accounts,
    );

    await expect(useCase.execute({ actor: founder, name: '' })).rejects.toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(identity.bindings.size).toBe(0);
    expect(await accounts.listByCompany('unused')).toEqual([]);
  });

  it('refuses an actor already bound to a company, without creating it nor rebinding', async () => {
    const stored = new Map<string, Company>();
    const companies = new InMemoryCompanyRepository(stored);
    const identity = new InMemoryCompanyIdentityBinder();
    const accounts = new InMemoryAccountRepository();
    await identity.bindEmployer('user-1', 'company-a');
    const useCase = new CreateCompanyUseCase(
      companies,
      identity,
      accounts,
    );

    await expect(
      useCase.execute({
        actor: { ...founder, companyId: 'company-a', role: UserRole.EMPLOYER },
        name: 'Beta',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(stored.size).toBe(0);
    expect(identity.bindings.get('user-1')).toBe('company-a');
    expect(await accounts.listByCompany('company-a')).toEqual([]);
  });

  it('creates a company and binds the founder as employer', async () => {
    const companies = new InMemoryCompanyRepository();
    const identity = new InMemoryCompanyIdentityBinder();
    const useCase = new CreateCompanyUseCase(
      companies,
      identity,
      new InMemoryAccountRepository(),
    );

    const company = await useCase.execute({ actor: founder, name: 'Acme' });

    expect(company.name.value).toBe('Acme');
    expect(await companies.findById(company.id)).toEqual(company);
    expect(identity.bindings.get('user-1')).toBe(company.id);
  });

  it('trims the company name', async () => {
    const useCase = new CreateCompanyUseCase(
      new InMemoryCompanyRepository(),
      new InMemoryCompanyIdentityBinder(),
      new InMemoryAccountRepository(),
    );

    const company = await useCase.execute({
      actor: founder,
      name: '  Acme  ',
    });

    expect(company.name.value).toBe('Acme');
  });

  it('refuses an empty identifier without creating a company', async () => {
    const stored = new Map<string, Company>();
    const companies = new InMemoryCompanyRepository(stored);
    const accounts = new InMemoryAccountRepository();
    const useCase = new CreateCompanyUseCase(
      companies,
      new InMemoryCompanyIdentityBinder(),
      accounts,
    );

    await expect(
      useCase.execute({
        actor: { ...founder, userId: '   ' },
        name: 'Acme',
      }),
    ).rejects.toThrow(ErrorCode.REQUIRED_INFORMATION);
    expect(stored.size).toBe(0);
  });

  it('attaches a single invited employer account to the created company', async () => {
    const accounts = new InMemoryAccountRepository();
    const useCase = new CreateCompanyUseCase(
      new InMemoryCompanyRepository(),
      new InMemoryCompanyIdentityBinder(),
      accounts,
    );

    const company = await useCase.execute({ actor: founder, name: 'Acme' });
    const attached = await accounts.listByCompany(company.id);

    expect(attached).toHaveLength(1);
    expect(attached[0]?.companyId).toBe(company.id);
    expect(attached[0]?.identifier.value).toBe(founder.userId);
    expect(attached[0]?.role).toBe(UserRole.EMPLOYER);
    expect(attached[0]?.status).toBe(AccountStatus.INVITED);
  });
});