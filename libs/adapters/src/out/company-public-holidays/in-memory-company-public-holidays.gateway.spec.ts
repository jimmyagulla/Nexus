import { describe, expect, it } from 'vitest';
import {
  CompanySettingsSnapshot,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { ICompanyPublicHolidaysGateway } from '@hexagonal-monorepo-template/ports';
import { RandomUuidGenerator } from '../id/random-uuid-generator';
import { InMemoryCompanyPublicHolidaysGateway } from './in-memory-company-public-holidays.gateway';

const acme: CompanySettingsSnapshot = {
  id: 'c1',
  name: 'Acme',
  nonWorkingWeekdays: [],
  publicHolidays: [{ id: 'ph-1', date: '2026-07-14', label: 'Fête nationale' }],
};

function gateway(): ICompanyPublicHolidaysGateway {
  return new InMemoryCompanyPublicHolidaysGateway(
    new RandomUuidGenerator(),
    new Map([['c1', acme]]),
  );
}

describe('InMemoryCompanyPublicHolidaysGateway', () => {
  it('retains a new public holiday under a fresh identifier', async () => {
    const company = await gateway().add('c1', '2026-12-25', 'Noël', 'token');

    expect(company.publicHolidays).toEqual([
      acme.publicHolidays[0],
      { id: expect.any(String), date: '2026-12-25', label: 'Noël' },
    ]);
    expect(company.publicHolidays[1].id).not.toBe('ph-1');
  });

  it('updates a public holiday in place', async () => {
    await expect(
      gateway().update('c1', 'ph-1', '2026-07-15', 'Lendemain', 'token'),
    ).resolves.toEqual({
      ...acme,
      publicHolidays: [{ id: 'ph-1', date: '2026-07-15', label: 'Lendemain' }],
    });
  });

  it('removes a public holiday', async () => {
    await expect(gateway().remove('c1', 'ph-1', 'token')).resolves.toEqual({
      ...acme,
      publicHolidays: [],
    });
  });

  it('refuses a public holiday the company does not have', async () => {
    await expect(gateway().remove('c1', 'ph-missing', 'token')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an unknown company', async () => {
    await expect(gateway().add('c2', '2026-12-25', 'Noël', 'token')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
