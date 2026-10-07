import { describe, expect, it } from 'vitest';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import {
  toAuditSnapshot,
  toAuditSnapshotCreate,
} from './prisma-audit-log.mapper';

describe('toAuditSnapshotCreate', () => {
  it('turns a snapshot into a side-tagged record', () => {
    expect(
      toAuditSnapshotCreate('BEFORE', {
        companyName: 'Acme',
        publicHolidayId: 'holiday-1',
        holidayDate: '2026-07-14',
        holidayLabel: 'Fête',
      }),
    ).toEqual({
      side: 'BEFORE',
      companyName: 'Acme',
      publicHolidayId: 'holiday-1',
      holidayDate: '2026-07-14',
      holidayLabel: 'Fête',
      daysOfWeek: undefined,
    });
  });

  it('nests the days of week as rows to create', () => {
    const record = toAuditSnapshotCreate('AFTER', {
      daysOfWeek: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    });

    expect(record.side).toBe('AFTER');
    expect(record.daysOfWeek).toEqual({
      create: [
        { dayOfWeek: DayOfWeek.SATURDAY },
        { dayOfWeek: DayOfWeek.SUNDAY },
      ],
    });
  });

  it('nests an empty list of days of week as no row', () => {
    expect(
      toAuditSnapshotCreate('AFTER', { daysOfWeek: [] })
        .daysOfWeek,
    ).toEqual({ create: [] });
  });
});

describe('toAuditSnapshot', () => {
  it('reports no snapshot when the side is absent', () => {
    expect(toAuditSnapshot(undefined)).toBeNull();
  });

  it('turns a record into a snapshot', () => {
    expect(
      toAuditSnapshot({
        companyName: 'Acme',
        publicHolidayId: 'holiday-1',
        holidayDate: '2026-07-14',
        holidayLabel: 'Fête',
        daysOfWeek: [{ dayOfWeek: DayOfWeek.MONDAY }],
      }),
    ).toEqual({
      companyName: 'Acme',
      publicHolidayId: 'holiday-1',
      holidayDate: '2026-07-14',
      holidayLabel: 'Fête',
      daysOfWeek: [DayOfWeek.MONDAY],
    });
  });

  it('turns empty columns into absent fields', () => {
    expect(
      toAuditSnapshot({
        companyName: null,
        publicHolidayId: null,
        holidayDate: null,
        holidayLabel: null,
        daysOfWeek: [],
      }),
    ).toEqual({
      companyName: undefined,
      publicHolidayId: undefined,
      holidayDate: undefined,
      holidayLabel: undefined,
      daysOfWeek: undefined,
    });
  });
});
