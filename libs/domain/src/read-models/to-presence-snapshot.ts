import { Presence } from '../entities/presence';
import { EmployeeReference } from '../facts/employee-reference';
import { PresenceSnapshot } from './presence-snapshot';

export function toPresenceSnapshot(
  presence: Presence,
  employee: EmployeeReference,
): PresenceSnapshot {
  return {
    id: presence.id,
    employeeId: presence.employeeId,
    employeeName: employee.fullName,
    month: presence.month.value,
    workedDays: presence.workedDays,
  };
}
