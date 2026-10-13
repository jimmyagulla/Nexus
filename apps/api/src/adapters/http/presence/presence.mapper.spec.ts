import { PresenceSnapshot } from '@hexagonal-monorepo-template/domain';
import { toPresenceListResponse } from './presence.mapper';

const camille: PresenceSnapshot = {
  id: 'p1',
  employeeId: 'e1',
  employeeName: 'Camille Martin',
  month: '2026-10',
  workedDays: 22,
};

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
