import { describe, expect, it } from 'vitest';
import {
  CalendarDate,
  HoursFact,
  HoursFactStatus,
} from '@hexagonal-monorepo-template/domain';
import { InMemoryHoursFactSource } from './in-memory-hours-fact.source';

function fact(id: string, companyId: string, employeeId: string): HoursFact {
  return {
    id,
    companyId,
    employeeId,
    date: CalendarDate.parse('2026-10-12'),
    hours: 2,
    sourceDeclarationId: `declaration-${id}`,
    status: HoursFactStatus.VALIDATED,
  };
}

describe('InMemoryHoursFactSource', () => {
  it('lists the hours facts of one employee of one company', async () => {
    const mine = fact('h1', 'c1', 'e1');
    const source = new InMemoryHoursFactSource([
      mine,
      fact('h2', 'c1', 'e2'),
      fact('h3', 'c2', 'e1'),
    ]);

    expect(await source.listForEmployee('c1', 'e1')).toEqual([mine]);
  });

  it('lists nothing when no fact was published', async () => {
    expect(
      await new InMemoryHoursFactSource().listForEmployee('c1', 'e1'),
    ).toEqual([]);
  });
});
