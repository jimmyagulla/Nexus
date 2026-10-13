import { Presence } from '../entities/presence';
import { AbsenceFact } from '../facts/absence-fact';
import { EmployeeReference } from '../facts/employee-reference';
import { HoursFact } from '../facts/hours-fact';
import { HoursFactStatus } from '../facts/hours-fact-status';
import { PresenceFacts } from '../facts/presence-facts';
import { SickLeaveDocument } from '../facts/sick-leave-document';
import { CalendarDate } from '../value-objects/calendar-date';
import { PresenceMonth } from '../value-objects/presence-month';
import { toPresenceSnapshot } from './to-presence-snapshot';

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

const noFacts: PresenceFacts = { absences: [], sickLeaves: [], hours: [] };

function absence(
  id: string,
  type: string,
  start: string,
  end: string,
  days = 1,
): AbsenceFact {
  return {
    id,
    companyId: 'c1',
    employeeId: 'e1',
    start: CalendarDate.parse(start),
    end: CalendarDate.parse(end),
    type,
    days,
    sourceRequestId: `r-${id}`,
  };
}

function sickLeave(id: string, date: string): SickLeaveDocument {
  return {
    id,
    companyId: 'c1',
    employeeId: 'e1',
    date: CalendarDate.parse(date),
  };
}

function hours(
  id: string,
  date: string,
  amount: number,
  status: HoursFactStatus = HoursFactStatus.PROCESSED,
): HoursFact {
  return {
    id,
    companyId: 'c1',
    employeeId: 'e1',
    date: CalendarDate.parse(date),
    hours: amount,
    sourceDeclarationId: `d-${id}`,
    status,
  };
}

describe('toPresenceSnapshot', () => {
  it('exposes the month of an employee as plain values', () => {
    expect(toPresenceSnapshot(presence, employee, noFacts)).toEqual({
      id: 'p1',
      employeeId: 'e1',
      employeeName: 'Camille Martin',
      month: '2026-10',
      workedDays: 22,
      proposedWorkedDays: 22,
      adjustments: [],
      leaves: [],
      absences: [],
      sickLeaves: [],
      overtime: [],
    });
  });

  it('keeps the proposed days beside the adjusted ones', () => {
    const snapshot = toPresenceSnapshot(
      presence.adjustWorkedDays(20, 'user-1', new Date('2026-10-13T09:00:00.000Z')),
      employee,
      noFacts,
    );

    expect(snapshot.workedDays).toBe(20);
    expect(snapshot.proposedWorkedDays).toBe(22);
  });

  it('writes each adjustment with the days before and after', () => {
    const snapshot = toPresenceSnapshot(
      presence
        .adjustWorkedDays(20, 'user-1', new Date('2026-10-13T09:00:00.000Z'))
        .adjustWorkedDays(21, 'user-2', new Date('2026-10-14T10:30:00.000Z')),
      employee,
      noFacts,
    );

    expect(snapshot.adjustments).toEqual([
      {
        actorId: 'user-1',
        occurredAt: '2026-10-13T09:00:00.000Z',
        before: 22,
        after: 20,
      },
      {
        actorId: 'user-2',
        occurredAt: '2026-10-14T10:30:00.000Z',
        before: 20,
        after: 21,
      },
    ]);
  });

  it('shows paid leave and RTT among the leaves', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      absences: [
        absence('a1', 'Congés payés', '2026-10-05', '2026-10-07', 3),
        absence('a2', 'RTT', '2026-10-12', '2026-10-12'),
      ],
    });

    expect(snapshot.leaves).toEqual([
      {
        id: 'a1',
        type: 'Congés payés',
        start: '2026-10-05',
        end: '2026-10-07',
        days: 3,
      },
      {
        id: 'a2',
        type: 'RTT',
        start: '2026-10-12',
        end: '2026-10-12',
        days: 1,
      },
    ]);
    expect(snapshot.absences).toEqual([]);
  });

  it('shows the other absence types among the absences', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      absences: [absence('a1', 'Absence exceptionnelle', '2026-10-08', '2026-10-08')],
    });

    expect(snapshot.absences).toEqual([
      {
        id: 'a1',
        type: 'Absence exceptionnelle',
        start: '2026-10-08',
        end: '2026-10-08',
        days: 1,
      },
    ]);
    expect(snapshot.leaves).toEqual([]);
  });

  it('leaves out an absence that does not reach the month', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      absences: [absence('a1', 'Congés payés', '2026-11-02', '2026-11-04')],
    });

    expect(snapshot.leaves).toEqual([]);
  });

  it('keeps an absence that straddles the month', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      absences: [absence('a1', 'Congés payés', '2026-09-28', '2026-10-02', 5)],
    });

    expect(snapshot.leaves.map((leave) => leave.id)).toEqual(['a1']);
  });

  it('lists the absences from the earliest to the latest', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      absences: [
        absence('late', 'Congés payés', '2026-10-20', '2026-10-21'),
        absence('early', 'Congés payés', '2026-10-05', '2026-10-06'),
      ],
    });

    expect(snapshot.leaves.map((leave) => leave.id)).toEqual(['early', 'late']);
  });

  it('shows the sick leave documents dated in the month', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      sickLeaves: [
        sickLeave('s1', '2026-10-14'),
        sickLeave('s0', '2026-09-30'),
        sickLeave('s2', '2026-11-01'),
      ],
    });

    expect(snapshot.sickLeaves).toEqual([{ id: 's1', date: '2026-10-14' }]);
  });

  it('lists the sick leaves from the earliest to the latest', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      sickLeaves: [sickLeave('late', '2026-10-20'), sickLeave('early', '2026-10-02')],
    });

    expect(snapshot.sickLeaves.map((leave) => leave.id)).toEqual([
      'early',
      'late',
    ]);
  });

  it('shows the overtime facts dated in the month', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      hours: [
        hours('h1', '2026-10-12', 2),
        hours('h0', '2026-09-30', 4),
        hours('h2', '2026-11-02', 1),
      ],
    });

    expect(snapshot.overtime).toEqual([
      { id: 'h1', date: '2026-10-12', hours: 2 },
    ]);
  });

  it('shows validated overtime as well as processed overtime', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      hours: [
        hours('h1', '2026-10-12', 2, HoursFactStatus.VALIDATED),
        hours('h2', '2026-10-13', 1.5, HoursFactStatus.PROCESSED),
      ],
    });

    expect(snapshot.overtime.map((entry) => entry.id)).toEqual(['h1', 'h2']);
  });

  it('lists the overtime from the earliest to the latest day', () => {
    const snapshot = toPresenceSnapshot(presence, employee, {
      ...noFacts,
      hours: [hours('late', '2026-10-20', 1), hours('early', '2026-10-02', 1)],
    });

    expect(snapshot.overtime.map((entry) => entry.id)).toEqual([
      'early',
      'late',
    ]);
  });
});
