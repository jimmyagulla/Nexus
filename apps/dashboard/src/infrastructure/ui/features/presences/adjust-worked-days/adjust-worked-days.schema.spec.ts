import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { adjustWorkedDaysSchema } from './adjust-worked-days.schema';

describe('adjustWorkedDaysSchema', () => {
  it('accepts a whole number of days', () => {
    expect(adjustWorkedDaysSchema.safeParse({ workedDays: 20 }).success).toBe(
      true,
    );
  });

  it('accepts no worked day at all', () => {
    expect(adjustWorkedDaysSchema.safeParse({ workedDays: 0 }).success).toBe(
      true,
    );
  });

  it.each([-1, 32, 20.5, Number.NaN])('rejects %s days', (workedDays) => {
    const result = adjustWorkedDaysSchema.safeParse({ workedDays });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        ErrorCode.REQUIRED_INFORMATION,
      );
    }
  });

  it('rejects a missing number of days', () => {
    expect(adjustWorkedDaysSchema.safeParse({}).success).toBe(false);
  });
});
