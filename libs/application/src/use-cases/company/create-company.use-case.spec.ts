import {
  InMemoryCompanyIdentityBinder,
  InMemoryCompanyRepository,
} from '@hexagonal-monorepo-template/adapters';
import {
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
    const useCase = new CreateCompanyUseCase(
      companies,
      identity,
    );

    await expect(useCase.execute({ actor: founder, name: '' })).rejects.toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
    expect(identity.bindings.size).toBe(0);
  });

  it('refuses an actor already bound to a company, without creating it nor rebinding', async () => {
    const stored = new Map<string, Company>();
    const companies = new InMemoryCompanyRepository(stored);
    const identity = new InMemoryCompanyIdentityBinder();
    await identity.bindEmployer('user-1', 'company-a');
    const useCase = new CreateCompanyUseCase(
      companies,
      identity,
    );

    await expect(
      useCase.execute({
        actor: { ...founder, companyId: 'company-a', role: UserRole.EMPLOYER },
        name: 'Beta',
      }),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(stored.size).toBe(0);
    expect(identity.bindings.get('user-1')).toBe('company-a');
  });

  it('creates a company and binds the founder as employer', async () => {
    const companies = new InMemoryCompanyRepository();
    const identity = new InMemoryCompanyIdentityBinder();
    const useCase = new CreateCompanyUseCase(
      companies,
      identity,
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
    );

    const company = await useCase.execute({
      actor: founder,
      name: '  Acme  ',
    });

    expect(company.name.value).toBe('Acme');
  });
});