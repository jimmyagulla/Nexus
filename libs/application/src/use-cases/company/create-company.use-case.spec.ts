import { ActorContext, ErrorCode  } from '@hexagonal-monorepo-template/domain';
import {
  MemoryIdentityBinder,
  MemoryCompanyRepository,
  MemoryIds,
} from './memory';
import { CreateCompanyUseCase } from './create-company.use-case';

const founder: ActorContext = {
  userId: 'user-1',
  companyId: null,
  role: null,
};

describe('CreateCompanyUseCase', () => {
  it('rejects an empty company name', async () => {
    const useCase = new CreateCompanyUseCase(
      new MemoryCompanyRepository(),
      new MemoryIds(),
      new MemoryIdentityBinder(),
    );

    await expect(useCase.execute({ actor: founder, name: '' })).rejects.toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('creates a company and binds the founder as employer', async () => {
    const companies = new MemoryCompanyRepository();
    const identity = new MemoryIdentityBinder();
    const useCase = new CreateCompanyUseCase(
      companies,
      new MemoryIds(),
      identity,
    );

    const company = await useCase.execute({ actor: founder, name: 'Acme' });

    expect(company.name.value).toBe('Acme');
    expect(await companies.findById(company.id)).toEqual(company);
    expect(identity.bindings.get('user-1')).toBe(company.id);
  });
});
