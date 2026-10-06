import { describe, expect, it, vi } from 'vitest';
import { CompanySettingsRepository } from '@hexagonal-monorepo-template/ports';
import { UpdateCompanyNameFromClientUseCase } from './update-company-name-from-client.use-case';

const snapshot = {
  id: 'c1',
  name: 'Acme RH',
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

describe('UpdateCompanyNameFromClientUseCase', () => {
  it('renames the company from the client command', async () => {
    const updateName = vi.fn().mockResolvedValue(snapshot);
    const useCase = new UpdateCompanyNameFromClientUseCase(repository({ updateName }));

    await expect(
      useCase.execute({ companyId: 'c1', name: 'Acme RH' }),
    ).resolves.toEqual(snapshot);
    expect(updateName).toHaveBeenCalledWith('c1', 'Acme RH');
  });
});
