import { describe, expect, it } from 'vitest';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { ICompanySettingsGateway } from '@hexagonal-monorepo-template/ports';
import { InMemoryCompanySettingsGateway } from './in-memory-company-settings.gateway';

const acme: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  publicHolidays: [],
};

function gateway(): ICompanySettingsGateway {
  return new InMemoryCompanySettingsGateway(new Map([['c1', acme]]));
}

describe('InMemoryCompanySettingsGateway', () => {
  it('reads the settings of a known company', async () => {
    await expect(gateway().get('c1', 'token')).resolves.toEqual(acme);
  });

  it('renames the company and keeps the new name', async () => {
    const settings = gateway();

    await settings.rename('c1', 'Nexus', 'token');

    await expect(settings.get('c1', 'token')).resolves.toEqual({ ...acme, name: 'Nexus' });
  });

  it('stores the non-working weekdays', async () => {
    await expect(
      gateway().setNonWorkingWeekdays('c1', [DayOfWeek.SUNDAY], 'token'),
    ).resolves.toEqual({ ...acme, nonWorkingWeekdays: [DayOfWeek.SUNDAY] });
  });

  it('refuses an unknown company', async () => {
    await expect(gateway().get('c2', 'token')).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });
});
