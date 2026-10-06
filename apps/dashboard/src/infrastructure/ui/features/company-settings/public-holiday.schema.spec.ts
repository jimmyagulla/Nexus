import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { publicHolidaySchema } from './public-holiday.schema';

describe('publicHolidaySchema', () => {
  it('accepts an ISO date and a label', () => {
    expect(
      publicHolidaySchema.safeParse({
        date: '2026-07-14',
        label: 'Fête nationale',
      }).success,
    ).toBe(true);
  });

  it('rejects a date that is not ISO formatted', () => {
    const result = publicHolidaySchema.safeParse({
      date: '14/07/2026',
      label: 'Fête nationale',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        ErrorCode.REQUIRED_INFORMATION,
      );
    }
  });

  it('rejects a blank label', () => {
    const result = publicHolidaySchema.safeParse({
      date: '2026-07-14',
      label: '   ',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        ErrorCode.REQUIRED_INFORMATION,
      );
    }
  });

  it('drops the spaces surrounding the label', () => {
    const result = publicHolidaySchema.safeParse({
      date: '2026-07-14',
      label: '  Fête nationale  ',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.label).toBe('Fête nationale');
    }
  });

  it('rejects an empty date', () => {
    const result = publicHolidaySchema.safeParse({
      date: '',
      label: 'Fête nationale',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        ErrorCode.REQUIRED_INFORMATION,
      );
    }
  });

  it('rejects a date whose month and day are not padded', () => {
    expect(
      publicHolidaySchema.safeParse({
        date: '2026-7-4',
        label: 'Fête nationale',
      }).success,
    ).toBe(false);
  });

  it('rejects a date carrying a time', () => {
    expect(
      publicHolidaySchema.safeParse({
        date: '2026-07-14T00:00:00.000Z',
        label: 'Fête nationale',
      }).success,
    ).toBe(false);
  });

  it('reports both fields when the date and the label are missing', () => {
    const result = publicHolidaySchema.safeParse({ date: '', label: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.map((issue) => issue.path.join('.')).sort(),
      ).toEqual(['date', 'label']);
    }
  });
});
