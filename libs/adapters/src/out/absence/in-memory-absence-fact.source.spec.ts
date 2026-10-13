import { describe, expect, it } from 'vitest';
import { AbsenceFact, CalendarDate } from '@hexagonal-monorepo-template/domain';
import { InMemoryAbsenceFactSource } from './in-memory-absence-fact.source';

function fact(id: string, companyId: string, employeeId: string): AbsenceFact {
  return {
    id,
    companyId,
    employeeId,
    start: CalendarDate.parse('2026-10-05'),
    end: CalendarDate.parse('2026-10-07'),
    type: 'Congés payés',
    days: 3,
    sourceRequestId: `request-${id}`,
  };
}

describe('InMemoryAbsenceFactSource', () => {
  it('lists the absence facts of one employee of one company', async () => {
    const mine = fact('a1', 'c1', 'e1');
    const source = new InMemoryAbsenceFactSource([
      mine,
      fact('a2', 'c1', 'e2'),
      fact('a3', 'c2', 'e1'),
    ]);

    expect(await source.listForEmployee('c1', 'e1')).toEqual([mine]);
  });

  it('lists nothing when no fact was published', async () => {
    expect(
      await new InMemoryAbsenceFactSource().listForEmployee('c1', 'e1'),
    ).toEqual([]);
  });
});
