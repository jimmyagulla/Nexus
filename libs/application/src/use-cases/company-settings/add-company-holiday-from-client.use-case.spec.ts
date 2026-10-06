import { describe, expect, it, vi } from 'vitest';
import { CompanySettingsRepository } from '@hexagonal-monorepo-template/ports';
import { AddCompanyHolidayFromClientUseCase } from './add-company-holiday-from-client.use-case';

const snapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [0, 6],
  holidays: [{ id: 'h1', date: '2026-07-14', label: 'Fête nationale' }],
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

describe('AddCompanyHolidayFromClientUseCase', () => {
  it('adds a public holiday from the client command', async () => {
    const addHoliday = vi.fn().mockResolvedValue(snapshot);
    const useCase = new AddCompanyHolidayFromClientUseCase(
      repository({ addHoliday }),
    );

    await expect(
      useCase.execute({
        companyId: 'c1',
        date: '2026-07-14',
        label: 'Fête nationale',
      }),
    ).resolves.toEqual(snapshot);
    expect(addHoliday).toHaveBeenCalledWith('c1', '2026-07-14', 'Fête nationale');
  });
});
