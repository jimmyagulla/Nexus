import { describe, expect, it, vi } from 'vitest';
import { CompanySettingsRepository } from '@hexagonal-monorepo-template/ports';
import { UpdateNonWorkingWeekdaysFromClientUseCase } from './update-non-working-weekdays-from-client.use-case';

const snapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [1, 6],
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

describe('UpdateNonWorkingWeekdaysFromClientUseCase', () => {
  it('updates non-working weekdays from the client command', async () => {
    const updateNonWorkingWeekdays = vi.fn().mockResolvedValue(snapshot);
    const useCase = new UpdateNonWorkingWeekdaysFromClientUseCase(
      repository({ updateNonWorkingWeekdays }),
    );

    await expect(
      useCase.execute({ companyId: 'c1', weekdays: [1, 6] }),
    ).resolves.toEqual(snapshot);
    expect(updateNonWorkingWeekdays).toHaveBeenCalledWith('c1', [1, 6]);
  });
});
