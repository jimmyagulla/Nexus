import { Weekday as DomainWeekday } from '@hexagonal-monorepo-template/domain';
import { describe, expect, it } from 'vitest';
import { Weekday as PrismaWeekday } from '../../../infrastructure/prisma/prisma-client';
import { toDomain } from './prisma-company.mapper';

describe('toDomain', () => {
  it('restores a company from a prisma row', () => {
    const company = toDomain({
      id: 'c1',
      name: 'Acme',
      nonWorkingWeekdays: [
        { companyId: 'c1', weekday: PrismaWeekday.SATURDAY },
      ],
      holidays: [
        {
          id: 'h1',
          companyId: 'c1',
          date: '2026-07-14',
          label: 'Fête nationale',
        },
      ],
    });

    expect(company.id).toBe('c1');
    expect(company.name).toBe('Acme');
    expect(company.nonWorkingWeekdays).toEqual([DomainWeekday.SATURDAY]);
    expect(company.holidays.map((holiday) => holiday.label)).toEqual([
      'Fête nationale',
    ]);
  });
});
