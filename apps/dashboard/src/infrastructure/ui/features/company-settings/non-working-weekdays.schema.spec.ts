import { describe, expect, it } from 'vitest';
import { nonWorkingWeekdaysSchema } from './non-working-weekdays.schema';

describe('nonWorkingWeekdaysSchema', () => {
  it('accepts weekday tokens and returns their numeric values', () => {
    expect(
      nonWorkingWeekdaysSchema.parse({ weekdays: ['1', '6', '0'] }),
    ).toEqual({ weekdays: [1, 6, 0] });
  });

  it('rejects a weekday outside the calendar', () => {
    expect(
      nonWorkingWeekdaysSchema.safeParse({ weekdays: ['7'] }).success,
    ).toBe(false);
  });

  it('accepts an empty selection', () => {
    expect(nonWorkingWeekdaysSchema.parse({ weekdays: [] })).toEqual({
      weekdays: [],
    });
  });
});
