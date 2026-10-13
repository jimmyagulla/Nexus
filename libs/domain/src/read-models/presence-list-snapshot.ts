import { EmployeeReference } from '../facts/employee-reference';
import { PresenceSnapshot } from './presence-snapshot';

export type PresenceListSnapshot = {
  presences: readonly PresenceSnapshot[];
  employees: readonly EmployeeReference[];
  canManage: boolean;
};
