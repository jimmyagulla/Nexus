import { describe, expect, it } from 'vitest';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { nonWorkingWeekdaysSchema } from './non-working-weekdays.schema';

describe('nonWorkingWeekdaysSchema', () => {
  it('accepts a selection of domain weekdays', () => {
    const result = nonWorkingWeekdaysSchema.safeParse({
      weekdays: [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.weekdays).toEqual([
        DayOfWeek.SATURDAY,
        DayOfWeek.SUNDAY,
      ]);
    }
  });

  it('accepts an empty selection', () => {
    expect(nonWorkingWeekdaysSchema.safeParse({ weekdays: [] }).success).toBe(
      true,
    );
  });

  it('accepts every weekday the domain knows', () => {
    expect(
      nonWorkingWeekdaysSchema.safeParse({
        weekdays: Object.values(DayOfWeek),
      }).success,
    ).toBe(true);
  });

  it('rejects a weekday the domain does not know', () => {
    expect(
      nonWorkingWeekdaysSchema.safeParse({ weekdays: ['CATURDAY'] }).success,
    ).toBe(false);
  });

  it('rejects a weekday spelled in another case', () => {
    expect(
      nonWorkingWeekdaysSchema.safeParse({ weekdays: ['sunday'] }).success,
    ).toBe(false);
  });

  it('rejects a single weekday handed outside of an array', () => {
    expect(
      nonWorkingWeekdaysSchema.safeParse({ weekdays: DayOfWeek.SUNDAY })
        .success,
    ).toBe(false);
  });

  it('rejects a missing selection', () => {
    expect(nonWorkingWeekdaysSchema.safeParse({}).success).toBe(false);
  });
});
