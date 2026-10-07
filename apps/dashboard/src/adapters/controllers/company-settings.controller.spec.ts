import { describe, expect, it } from 'vitest';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import { CompanySettingsController } from './company-settings.controller';

const snapshot: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  publicHolidays: [],
};

function controller(): CompanySettingsController {
  return new CompanySettingsController(
    { execute: async () => snapshot },
    { execute: async (name) => ({ ...snapshot, name }) },
    {
      execute: async (weekdays) => ({
        ...snapshot,
        nonWorkingWeekdays: [...weekdays],
      }),
    },
    {
      execute: async (input) => ({
        ...snapshot,
        publicHolidays: [{ id: 'ph-1', ...input }],
      }),
    },
    {
      execute: async (publicHolidayId) => ({
        ...snapshot,
        publicHolidays: [{ id: publicHolidayId, date: '', label: 'removed' }],
      }),
    },
  );
}

describe('CompanySettingsController', () => {
  it('hands back the settings of the current session', async () => {
    await expect(controller().getSettings()).resolves.toEqual(snapshot);
  });

  it('hands back the renamed settings', async () => {
    await expect(controller().renameCompany('Nexus')).resolves.toMatchObject({
      name: 'Nexus',
    });
  });

  it('hands back the updated non-working weekdays', async () => {
    const settings = await controller().updateNonWorkingWeekdays([
      DayOfWeek.SUNDAY,
    ]);

    expect(settings.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
  });

  it('hands back the settings carrying the new public holiday', async () => {
    const settings = await controller().addPublicHoliday({
      date: '2026-07-14',
      label: 'Bastille Day',
    });

    expect(settings.publicHolidays).toEqual([
      { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
    ]);
  });

  it('forwards the public holiday to remove', async () => {
    const settings = await controller().removePublicHoliday('ph-9');

    expect(settings.publicHolidays[0]?.id).toBe('ph-9');
  });
});
