import { describe, expect, it } from 'vitest';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryCompanyPublicHolidaysGateway } from './in-memory-company-public-holidays.gateway';

function snapshots(): Map<string, CompanySettingsSnapshot> {
  return new Map([
    [
      'c1',
      {
        id: 'c1',
        name: 'Acme',
        nonWorkingWeekdays: [DayOfWeek.SATURDAY],
        publicHolidays: [
          { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
        ],
      },
    ],
    [
      'c2',
      { id: 'c2', name: 'Globex', nonWorkingWeekdays: [], publicHolidays: [] },
    ],
  ]);
}

describe('InMemoryCompanyPublicHolidaysGateway', () => {
  it('appends a public holiday and retains it', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    const updated = await publicHolidays.add(
      'c1',
      '2026-11-01',
      'All Saints',
      'token',
    );

    expect(updated.publicHolidays).toEqual([
      { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
      { id: '2026-11-01-All Saints', date: '2026-11-01', label: 'All Saints' },
    ]);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toHaveLength(2);
  });

  it('keeps the rest of the settings untouched when appending', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    const updated = await publicHolidays.add(
      'c1',
      '2026-11-01',
      'All Saints',
      'token',
    );

    expect(updated.name).toBe('Acme');
    expect(updated.nonWorkingWeekdays).toEqual([DayOfWeek.SATURDAY]);
  });

  it('refuses to append with a token other than the granted one', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    await expect(
      publicHolidays.add('c1', '2026-11-01', 'All Saints', 'other-token'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toHaveLength(1);
  });

  it('refuses to append to an unknown company', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    await expect(
      publicHolidays.add('c-missing', '2026-11-01', 'All Saints', 'token'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('replaces the date and the label of a holiday, keeping its id', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    const updated = await publicHolidays.update(
      'c1',
      'ph-1',
      '2026-07-15',
      'National Day',
      'token',
    );

    expect(updated.publicHolidays).toEqual([
      { id: 'ph-1', date: '2026-07-15', label: 'National Day' },
    ]);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toEqual([
      { id: 'ph-1', date: '2026-07-15', label: 'National Day' },
    ]);
  });

  it('leaves the other holidays untouched when replacing one', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );
    await publicHolidays.add('c1', '2026-11-01', 'All Saints', 'token');

    const updated = await publicHolidays.update(
      'c1',
      'ph-1',
      '2026-07-15',
      'National Day',
      'token',
    );

    expect(updated.publicHolidays).toEqual([
      { id: 'ph-1', date: '2026-07-15', label: 'National Day' },
      { id: '2026-11-01-All Saints', date: '2026-11-01', label: 'All Saints' },
    ]);
  });

  it('refuses to replace a holiday the company never retained', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    await expect(
      publicHolidays.update(
        'c1',
        'ph-missing',
        '2026-07-15',
        'National Day',
        'token',
      ),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toEqual([
      { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
    ]);
  });

  it('refuses to replace with a token other than the granted one', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    await expect(
      publicHolidays.update(
        'c1',
        'ph-1',
        '2026-07-15',
        'National Day',
        'other-token',
      ),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toEqual([
      { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
    ]);
  });

  it('drops the targeted public holiday', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    const updated = await publicHolidays.remove('c1', 'ph-1', 'token');

    expect(updated.publicHolidays).toEqual([]);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toEqual([]);
  });

  it('keeps the other holidays when dropping one', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );
    await publicHolidays.add('c1', '2026-11-01', 'All Saints', 'token');

    const updated = await publicHolidays.remove('c1', 'ph-1', 'token');

    expect(updated.publicHolidays).toEqual([
      { id: '2026-11-01-All Saints', date: '2026-11-01', label: 'All Saints' },
    ]);
  });

  it('refuses to drop a holiday the company never retained', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    await expect(
      publicHolidays.remove('c1', 'ph-missing', 'token'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toEqual([
      { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
    ]);
  });

  it('refuses to drop with a token other than the granted one', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    await expect(
      publicHolidays.remove('c1', 'ph-1', 'other-token'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(publicHolidays.snapshotOf('c1').publicHolidays).toEqual([
      { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
    ]);
  });

  it('refuses to drop from an unknown company', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    await expect(
      publicHolidays.remove('c-missing', 'ph-1', 'token'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
  });

  it('keeps the holidays of two companies apart', async () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    await publicHolidays.add('c1', '2026-11-01', 'All Saints', 'token');

    expect(publicHolidays.snapshotOf('c2').publicHolidays).toEqual([]);
  });

  it('refuses to read an unknown company through its own accessor', () => {
    const publicHolidays = new InMemoryCompanyPublicHolidaysGateway(
      'token',
      snapshots(),
    );

    expect(() => publicHolidays.snapshotOf('c-missing')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });
});
