import { describe, expect, it, vi } from 'vitest';
import { CompanySettingsRepository } from '@hexagonal-monorepo-template/ports';
import { RemoveCompanyHolidayFromClientUseCase } from './remove-company-holiday-from-client.use-case';

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

describe('RemoveCompanyHolidayFromClientUseCase', () => {
  it('removes a public holiday from the client command', async () => {
    const removeHoliday = vi.fn().mockResolvedValue(snapshot);
    const useCase = new RemoveCompanyHolidayFromClientUseCase(
      repository({ removeHoliday }),
    );

    await expect(
      useCase.execute({ companyId: 'c1', holidayId: 'h1' }),
    ).resolves.toEqual(snapshot);
    expect(removeHoliday).toHaveBeenCalledWith('c1', 'h1');
  });
});
