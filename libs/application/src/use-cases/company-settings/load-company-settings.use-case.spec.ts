import { describe, expect, it, vi } from 'vitest';
import { CompanySettingsRepository } from '@hexagonal-monorepo-template/ports';
import { LoadCompanySettingsUseCase } from './load-company-settings.use-case';

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

describe('LoadCompanySettingsUseCase', () => {
  it('loads settings for the requested company', async () => {
    const find = vi.fn().mockResolvedValue(snapshot);
    const useCase = new LoadCompanySettingsUseCase(repository({ find }));

    await expect(useCase.execute({ companyId: 'c1' })).resolves.toEqual(snapshot);
    expect(find).toHaveBeenCalledWith('c1');
  });
});
