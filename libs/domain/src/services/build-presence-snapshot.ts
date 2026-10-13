import { Presence } from '../entities/presence';
import { AbsenceFact } from '../facts/absence-fact';
import { EmployeeReference } from '../facts/employee-reference';
import { HoursFact } from '../facts/hours-fact';
import { SickLeaveDocument } from '../facts/sick-leave-document';
import { PresenceSnapshot } from '../read-models/presence-snapshot';
import { toPresenceSnapshot } from '../read-models/to-presence-snapshot';

type FactsOfEmployee<Fact> = {
  listForEmployee(
    companyId: string,
    employeeId: string,
  ): Promise<readonly Fact[]>;
};

export type PresenceFactSources = {
  absences: FactsOfEmployee<AbsenceFact>;
  sickLeaves: FactsOfEmployee<SickLeaveDocument>;
  hours: FactsOfEmployee<HoursFact>;
};

export async function buildPresenceSnapshot(
  presence: Presence,
  employee: EmployeeReference,
  sources: PresenceFactSources,
): Promise<PresenceSnapshot> {
  const [absences, sickLeaves, hours] = await Promise.all([
    sources.absences.listForEmployee(presence.companyId, presence.employeeId),
    sources.sickLeaves.listForEmployee(presence.companyId, presence.employeeId),
    sources.hours.listForEmployee(presence.companyId, presence.employeeId),
  ]);

  return toPresenceSnapshot(presence, employee, { absences, sickLeaves, hours });
}
