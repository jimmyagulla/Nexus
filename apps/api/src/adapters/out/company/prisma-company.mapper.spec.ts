import { describe, expect, it } from 'vitest';
import { DayOfWeek, ErrorCode } from '@hexagonal-monorepo-template/domain';
import { PrismaCompanyRow, toCompany } from './prisma-company.mapper';

function rowOf(overrides: Partial<PrismaCompanyRow> = {}): PrismaCompanyRow {
  return {
    id: 'c1',
    name: 'Acme',
    nonWorkingWeekdays: [],
    publicHolidays: [],
    ...overrides,
  };
}

describe('toCompany', () => {
  it('maps a prisma row to a company', () => {
    const company = toCompany({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [{ dayOfWeek: DayOfWeek.SUNDAY }],
      publicHolidays: [
        {
          publicHoliday: {
            id: 'ph-1',
            date: '2026-07-14',
            label: 'Bastille Day',
          },
        },
      ],
    });

    expect(company.id).toBe('c1');
    expect(company.name.value).toBe('Acme');
    expect(company.calendar.nonWorkingWeekdays).toEqual([DayOfWeek.SUNDAY]);
    expect(company.calendar.publicHolidays[0]?.publicHoliday.label).toBe(
      'Bastille Day',
    );
  });

  it('maps a company without weekday nor holiday to an empty calendar', () => {
    const company = toCompany(rowOf());

    expect(company.calendar.nonWorkingWeekdays).toEqual([]);
    expect(company.calendar.publicHolidays).toEqual([]);
  });

  it('keeps every weekday and every holiday of the row', () => {
    const company = toCompany(
      rowOf({
        nonWorkingWeekdays: [
          { dayOfWeek: DayOfWeek.SATURDAY },
          { dayOfWeek: DayOfWeek.SUNDAY },
        ],
        publicHolidays: [
          { publicHoliday: { id: 'ph-1', date: '2026-07-14', label: 'Fête' } },
          { publicHoliday: { id: 'ph-2', date: '2026-12-25', label: 'Noël' } },
        ],
      }),
    );

    expect(company.calendar.nonWorkingWeekdays).toEqual([
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ]);
    expect(
      company.calendar.publicHolidays.map(
        (holiday) => holiday.publicHoliday.date.value,
      ),
    ).toEqual(['2026-07-14', '2026-12-25']);
  });

  it('attaches every holiday to the company that retains it', () => {
    const company = toCompany(
      rowOf({
        id: 'c2',
        publicHolidays: [
          { publicHoliday: { id: 'ph-1', date: '2026-07-14', label: 'Fête' } },
        ],
      }),
    );

    expect(company.calendar.publicHolidays[0]?.companyId).toBe('c2');
  });

  it('refuses a row whose stored name is blank', () => {
    expect(() => toCompany(rowOf({ name: '   ' }))).toThrow(
      ErrorCode.REQUIRED_INFORMATION,
    );
  });

  it('refuses a row whose stored holiday date is malformed', () => {
    expect(() =>
      toCompany(
        rowOf({
          publicHolidays: [
            {
              publicHoliday: { id: 'ph-1', date: '14/07/2026', label: 'Fête' },
            },
          ],
        }),
      ),
    ).toThrow(ErrorCode.REQUIRED_INFORMATION);
  });

  it('trims the stored name', () => {
    expect(toCompany(rowOf({ name: '  Acme  ' })).name.value).toBe('Acme');
  });
});
