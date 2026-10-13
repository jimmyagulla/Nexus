import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import { openPresenceSchema } from './open-presence.schema';

describe('openPresenceSchema', () => {
  it('accepts an employee and a calendar month', () => {
    expect(
      openPresenceSchema.safeParse({ employeeId: 'e1', month: '2026-10' })
        .success,
    ).toBe(true);
  });

  it('rejects a missing employee', () => {
    const result = openPresenceSchema.safeParse({
      employeeId: '',
      month: '2026-10',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        ErrorCode.REQUIRED_INFORMATION,
      );
    }
  });

  it.each(['', '2026-13', '2026-1', '2026-10-05', 'october'])(
    'rejects the month %s',
    (month) => {
      const result = openPresenceSchema.safeParse({ employeeId: 'e1', month });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          ErrorCode.REQUIRED_INFORMATION,
        );
      }
    },
  );

  it('reports both fields when the employee and the month are missing', () => {
    const result = openPresenceSchema.safeParse({ employeeId: '', month: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.map((issue) => issue.path.join('.')).sort(),
      ).toEqual(['employeeId', 'month']);
    }
  });
});
