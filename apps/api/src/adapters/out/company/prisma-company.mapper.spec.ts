import { describe, expect, it } from 'vitest';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { toCompany } from './prisma-company.mapper';

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
});
