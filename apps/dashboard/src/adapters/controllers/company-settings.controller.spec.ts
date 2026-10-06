import { describe, expect, it } from 'vitest';
import { CompanySettingsController } from './company-settings.controller';

describe('CompanySettingsController', () => {
  it('delegates loading settings', async () => {
    const snapshot = {
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [],
      publicHolidays: [],
    };
    const controller = new CompanySettingsController(
      { execute: async () => snapshot },
      { execute: async () => snapshot },
      { execute: async () => snapshot },
      { execute: async () => snapshot },
      { execute: async () => snapshot },
    );

    await expect(controller.getSettings()).resolves.toEqual(snapshot);
  });
});
