import { describe, expect, it } from 'vitest';
import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryCompanySettingsGateway } from './in-memory-company-settings.gateway';

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

describe('InMemoryCompanySettingsGateway', () => {
  it('hands back the snapshot of the requested company', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    await expect(settings.get('c1', 'token')).resolves.toEqual({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [DayOfWeek.SATURDAY],
      publicHolidays: [
        { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
      ],
    });
  });

  it('refuses a token other than the granted one', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    await expect(settings.get('c1', 'other-token')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses an unknown company', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    await expect(settings.get('c-missing', 'token')).rejects.toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('refuses to read an unknown company through its own accessor', () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    expect(() => settings.snapshotOf('c-missing')).toThrow(
      ErrorCode.ACCESS_DENIED,
    );
  });

  it('renames the company and retains the new name', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    const renamed = await settings.rename('c1', 'Acme Corp', 'token');

    expect(renamed.name).toBe('Acme Corp');
    expect(settings.snapshotOf('c1').name).toBe('Acme Corp');
  });

  it('keeps the calendar untouched when renaming', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    await settings.rename('c1', 'Acme Corp', 'token');

    expect(settings.snapshotOf('c1')).toEqual({
      id: 'c1',
      name: 'Acme Corp',
      nonWorkingWeekdays: [DayOfWeek.SATURDAY],
      publicHolidays: [
        { id: 'ph-1', date: '2026-07-14', label: 'Bastille Day' },
      ],
    });
  });

  it('refuses to rename with a wrong token and leaves the name untouched', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    await expect(
      settings.rename('c1', 'Acme Corp', 'other-token'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(settings.snapshotOf('c1').name).toBe('Acme');
  });

  it('replaces the non-working weekdays and retains them', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    const updated = await settings.setNonWorkingWeekdays(
      'c1',
      [DayOfWeek.MONDAY, DayOfWeek.SUNDAY],
      'token',
    );

    expect(updated.nonWorkingWeekdays).toEqual([
      DayOfWeek.MONDAY,
      DayOfWeek.SUNDAY,
    ]);
    expect(settings.snapshotOf('c1').nonWorkingWeekdays).toEqual([
      DayOfWeek.MONDAY,
      DayOfWeek.SUNDAY,
    ]);
  });

  it('empties the non-working weekdays when given no day', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    await settings.setNonWorkingWeekdays('c1', [], 'token');

    expect(settings.snapshotOf('c1').nonWorkingWeekdays).toEqual([]);
  });

  it('copies the given weekdays, so the caller cannot alter them afterwards', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());
    const weekdays: DayOfWeek[] = [DayOfWeek.MONDAY];

    await settings.setNonWorkingWeekdays('c1', weekdays, 'token');
    weekdays.push(DayOfWeek.TUESDAY);

    expect(settings.snapshotOf('c1').nonWorkingWeekdays).toEqual([
      DayOfWeek.MONDAY,
    ]);
  });

  it('refuses to set the weekdays with a wrong token and leaves them untouched', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    await expect(
      settings.setNonWorkingWeekdays('c1', [DayOfWeek.MONDAY], 'other-token'),
    ).rejects.toThrow(ErrorCode.ACCESS_DENIED);
    expect(settings.snapshotOf('c1').nonWorkingWeekdays).toEqual([
      DayOfWeek.SATURDAY,
    ]);
  });

  it('keeps the snapshots of two companies apart', async () => {
    const settings = new InMemoryCompanySettingsGateway('token', snapshots());

    await settings.rename('c1', 'Acme Corp', 'token');

    expect(settings.snapshotOf('c2').name).toBe('Globex');
  });
});
