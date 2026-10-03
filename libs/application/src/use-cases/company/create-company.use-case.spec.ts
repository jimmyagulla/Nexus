import { describe, expect, it } from 'vitest';
import { InMemoryCompanyRepository } from '@hexagonal-monorepo-template/adapters';
import { CreateCompanyUseCase } from './create-company.use-case';

describe('CreateCompanyUseCase', () => {
  it('persists a new company with default calendar', async () => {
    const repository = new InMemoryCompanyRepository();
    const useCase = new CreateCompanyUseCase(repository);

    const company = await useCase.execute('Acme RH');

    expect(company.name).toBe('Acme RH');
    expect(await repository.findById(company.id)).not.toBeNull();
  });
});
