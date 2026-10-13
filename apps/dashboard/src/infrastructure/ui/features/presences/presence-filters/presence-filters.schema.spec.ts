import { describe, expect, it } from 'vitest';
import { ErrorCode } from '@hexagonal-monorepo-template/domain';
import {
  ALL_EMPLOYEES,
  presenceFiltersSchema,
  toPresenceListFilter,
} from './presence-filters.schema';

const open = { employeeId: ALL_EMPLOYEES, from: '', to: '' };

describe('presenceFiltersSchema', () => {
  it('accepts no filter at all', () => {
    expect(presenceFiltersSchema.safeParse(open).success).toBe(true);
  });

  it('accepts an employee and a period', () => {
    expect(
      presenceFiltersSchema.safeParse({
        employeeId: 'e1',
        from: '2026-08',
        to: '2026-10',
      }).success,
    ).toBe(true);
  });

  it('accepts a period that starts and ends the same month', () => {
    expect(
      presenceFiltersSchema.safeParse({ ...open, from: '2026-09', to: '2026-09' })
        .success,
    ).toBe(true);
  });

  it('accepts a single bound', () => {
    expect(
      presenceFiltersSchema.safeParse({ ...open, from: '2026-09' }).success,
    ).toBe(true);
    expect(
      presenceFiltersSchema.safeParse({ ...open, to: '2026-09' }).success,
    ).toBe(true);
  });

  it('refuses a period whose end precedes its start, on the end', () => {
    const result = presenceFiltersSchema.safeParse({
      ...open,
      from: '2026-10',
      to: '2026-09',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(['to']);
      expect(result.error.issues[0]?.message).toBe(ErrorCode.INVALID_PERIOD);
    }
  });

  it.each(['2026-13', '2026-1', '2026-10-05', 'october'])(
    'refuses the malformed start month %s',
    (from) => {
      const result = presenceFiltersSchema.safeParse({ ...open, from });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          ErrorCode.REQUIRED_INFORMATION,
        );
      }
    },
  );

  it('refuses a malformed end month', () => {
    expect(
      presenceFiltersSchema.safeParse({ ...open, to: '2026-13' }).success,
    ).toBe(false);
  });
});

describe('toPresenceListFilter', () => {
  it('leaves every filter out when nothing is chosen', () => {
    expect(toPresenceListFilter(open)).toEqual({});
  });

  it('keeps the chosen employee and period', () => {
    expect(
      toPresenceListFilter({ employeeId: 'e1', from: '2026-08', to: '2026-10' }),
    ).toEqual({ employeeId: 'e1', from: '2026-08', to: '2026-10' });
  });

  it('leaves out the bound nobody typed', () => {
    expect(
      toPresenceListFilter({ employeeId: ALL_EMPLOYEES, from: '2026-08', to: '' }),
    ).toEqual({ from: '2026-08' });
  });
});
