import { describe, expect, it, vi } from 'vitest';
import { CompanySettingsRepository } from '@hexagonal-monorepo-template/ports';
import { CreateCompanyFromClientUseCase } from './create-company-from-client.use-case';

const snapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [0, 6],
  holidays: [],
};

function repository(
  overrides: Partial<CompanySettingsRepository> = {},
): CompanySettingsRepository {
  return {
    create: vi.fn(),
    find: vi.fn(),
    updateName: vi.fn(),
    updateNonWorkingWeekdays: vi.fn(),
    addHoliday: vi.fn(),
    removeHoliday: vi.fn(),
    ...overrides,
  };
}

describe('CreateCompanyFromClientUseCase', () => {
  it('creates a company from the client command', async () => {
    const create = vi.fn().mockResolvedValue(snapshot);
    const useCase = new CreateCompanyFromClientUseCase(repository({ create }));

    await expect(useCase.execute({ name: 'Acme' })).resolves.toEqual(snapshot);
    expect(create).toHaveBeenCalledWith('Acme');
  });
});
