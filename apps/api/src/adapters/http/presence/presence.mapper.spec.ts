import { PresenceSnapshot } from '@hexagonal-monorepo-template/domain';
import { toPresenceListResponse, toPresenceResponse } from './presence.mapper';

const camille: PresenceSnapshot = {
  id: 'p1',
  employeeId: 'e1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 20,
  proposedWorkedDays: 22,
  adjustments: [
    {
      actorId: 'user-1',
      occurredAt: '2026-10-13T09:00:00.000Z',
      before: 22,
      after: 20,
    },
  ],
  leaves: [
    {
      id: 'a1',
      type: 'Congés payés',
      start: '2026-10-05',
      end: '2026-10-07',
      days: 3,
    },
  ],
  absences: [
    {
      id: 'a2',
      type: 'Autre',
      start: '2026-10-08',
      end: '2026-10-08',
      days: 1,
    },
  ],
  sickLeaves: [{ id: 's1', date: '2026-10-14' }],
  overtime: [{ id: 'h1', date: '2026-10-12', hours: 2 }],
};

describe('toPresenceResponse', () => {
  it('answers every rubric of the month as plain data', () => {
    expect(toPresenceResponse(camille)).toEqual(camille);
  });

  it('answers the proposed days beside the adjusted ones, with the history', () => {
    expect(toPresenceResponse(camille)).toMatchObject({
      workedDays: 20,
      proposedWorkedDays: 22,
      adjustments: [
        {
          actorId: 'user-1',
          occurredAt: '2026-10-13T09:00:00.000Z',
          before: 22,
          after: 20,
        },
      ],
    });
  });

  it('answers an empty history as an empty list', () => {
    expect(toPresenceResponse({ ...camille, adjustments: [] }).adjustments).toEqual(
      [],
    );
  });

  it('answers empty rubrics as empty lists', () => {
    expect(
      toPresenceResponse({
        ...camille,
        leaves: [],
        absences: [],
        sickLeaves: [],
        overtime: [],
      }),
    ).toMatchObject({ leaves: [], absences: [], sickLeaves: [], overtime: [] });
  });
});

describe('toPresenceListResponse', () => {
  it('answers the presences and the employees as plain data', () => {
    expect(
      toPresenceListResponse({
        presences: [camille],
        employees: [{ id: 'e1', companyId: 'c1', fullName: 'Camille Martin' }],
        canManage: true,
      }),
    ).toEqual({
      presences: [camille],
      employees: [{ id: 'e1', fullName: 'Camille Martin' }],
      canManage: true,
    });
  });
});
