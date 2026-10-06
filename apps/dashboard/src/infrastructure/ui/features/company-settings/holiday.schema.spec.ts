import { describe, expect, it } from 'vitest';
import { ErrorMessage } from '@hexagonal-monorepo-template/domain';
import { holidaySchema } from './holiday.schema';

describe('holidaySchema', () => {
  it('accepts a dated public holiday', () => {
    expect(
      holidaySchema.parse({
        date: '2026-07-14',
        label: '  Fête nationale  ',
      }),
    ).toEqual({
      date: '2026-07-14',
      label: 'Fête nationale',
    });
  });

  it('rejects a holiday date that is not a calendar day', () => {
    const parsed = holidaySchema.safeParse({
      date: '14/07/2026',
      label: 'Fête nationale',
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        ErrorMessage.INFORMATION_OBLIGATOIRE,
      );
    }
  });

  it('rejects an empty holiday label with the domain message', () => {
    const parsed = holidaySchema.safeParse({
      date: '2026-07-14',
      label: '   ',
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        ErrorMessage.INFORMATION_OBLIGATOIRE,
      );
    }
  });
});
