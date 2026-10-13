import { Presence } from '../entities/presence';
import { EmployeeReference } from '../facts/employee-reference';
import { PresenceMonth } from '../value-objects/presence-month';
import { toPresenceSnapshot } from './to-presence-snapshot';

const employee: EmployeeReference = {
  id: 'e1',
  companyId: 'c1',
  fullName: 'Camille Martin',
};

describe('toPresenceSnapshot', () => {
  it('exposes the month of an employee as plain values', () => {
    const presence = new Presence(
      'p1',
      'c1',
      'e1',
      PresenceMonth.parse('2026-10'),
      22,
    );

    expect(toPresenceSnapshot(presence, employee)).toEqual({
      id: 'p1',
      employeeId: 'e1',
      employeeName: 'Camille Martin',
      month: '2026-10',
      workedDays: 22,
    });
  });
});
