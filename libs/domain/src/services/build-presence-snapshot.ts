import { Presence } from '../entities/presence';
import { AbsenceFact } from '../facts/absence-fact';
import { EmployeeReference } from '../facts/employee-reference';
import { HoursFact } from '../facts/hours-fact';
import { SickLeaveDocument } from '../facts/sick-leave-document';
import { PresenceSnapshot } from '../read-models/presence-snapshot';
import { toPresenceSnapshot } from '../read-models/to-presence-snapshot';

export type PresenceFactSources = {
  absences: (
    companyId: string,
    employeeId: string,
  ) => Promise<readonly AbsenceFact[]>;
  sickLeaves: (
    companyId: string,
    employeeId: string,
  ) => Promise<readonly SickLeaveDocument[]>;
  hours: (
    companyId: string,
    employeeId: string,
  ) => Promise<readonly HoursFact[]>;
};

export async function buildPresenceSnapshot(
  presence: Presence,
  employee: EmployeeReference,
  sources: PresenceFactSources,
): Promise<PresenceSnapshot> {
  const [absences, sickLeaves, hours] = await Promise.all([
    sources.absences(presence.companyId, presence.employeeId),
    sources.sickLeaves(presence.companyId, presence.employeeId),
    sources.hours(presence.companyId, presence.employeeId),
  ]);

  return toPresenceSnapshot(presence, employee, { absences, sickLeaves, hours });
}
