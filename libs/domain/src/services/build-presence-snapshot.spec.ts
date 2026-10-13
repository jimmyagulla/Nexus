import { Presence } from '../entities/presence';
import { EmployeeReference } from '../facts/employee-reference';
import { CalendarDate } from '../value-objects/calendar-date';
import { PresenceMonth } from '../value-objects/presence-month';
import { buildPresenceSnapshot } from './build-presence-snapshot';

const employee: EmployeeReference = {
  id: 'e1',
  companyId: 'c1',
  fullName: 'Camille Martin',
};

const presence = new Presence(
  'p1',
  'c1',
  'e1',
  PresenceMonth.parse('2026-10'),
  22,
);

describe('buildPresenceSnapshot', () => {
  it('reads the facts of the employee of the presence', async () => {
    const asked: string[] = [];
    const ask = (source: string) => async (companyId: string, employeeId: string) => {
      asked.push(`${source}:${companyId}:${employeeId}`);
      return [];
    };

    await buildPresenceSnapshot(presence, employee, {
      absences: ask('absences'),
      sickLeaves: ask('sickLeaves'),
      hours: ask('hours'),
    });

    expect(asked.sort()).toEqual([
      'absences:c1:e1',
      'hours:c1:e1',
      'sickLeaves:c1:e1',
    ]);
  });

  it('shows the facts the sources answered', async () => {
    const snapshot = await buildPresenceSnapshot(presence, employee, {
      absences: async () => [
        {
          id: 'a1',
          companyId: 'c1',
          employeeId: 'e1',
          start: CalendarDate.parse('2026-10-05'),
          end: CalendarDate.parse('2026-10-07'),
          type: 'Congés payés',
          days: 3,
          sourceRequestId: 'r1',
        },
      ],
      sickLeaves: async () => [],
      hours: async () => [],
    });

    expect(snapshot.leaves.map((leave) => leave.id)).toEqual(['a1']);
    expect(snapshot.workedDays).toBe(22);
  });

  it('leaves the rubrics empty when the sources hold no fact', async () => {
    const snapshot = await buildPresenceSnapshot(presence, employee, {
      absences: async () => [],
      sickLeaves: async () => [],
      hours: async () => [],
    });

    expect([
      snapshot.leaves,
      snapshot.absences,
      snapshot.sickLeaves,
      snapshot.overtime,
    ]).toEqual([[], [], [], []]);
  });
});
