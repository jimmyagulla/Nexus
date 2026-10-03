import { describe, expect, it } from 'vitest';
import { InMemoryCompanyRepository } from '@hexagonal-monorepo-template/adapters';
import { CreateCompanyUseCase } from './create-company.use-case';
import { GetCompanySettingsUseCase } from './get-company-settings.use-case';

describe('GetCompanySettingsUseCase', () => {
  it('returns settings for the actor company', async () => {
    const repository = new InMemoryCompanyRepository();
    const created = await new CreateCompanyUseCase(repository).execute('Acme');
    const settings = await new GetCompanySettingsUseCase(repository).execute({
      companyId: created.id,
      actorCompanyId: created.id,
    });

    expect(settings.name).toBe('Acme');
  });

  it('refuses access to another company perimeter', async () => {
    const repository = new InMemoryCompanyRepository();
    const companyA = await new CreateCompanyUseCase(repository).execute('A');
    const companyB = await new CreateCompanyUseCase(repository).execute('B');

    await expect(
      new GetCompanySettingsUseCase(repository).execute({
        companyId: companyA.id,
        actorCompanyId: companyB.id,
      }),
    ).rejects.toBeInstanceOf(Error);
  });
});
