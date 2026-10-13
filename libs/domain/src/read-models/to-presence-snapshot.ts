import { Presence } from '../entities/presence';
import { AbsenceFact } from '../facts/absence-fact';
import { EmployeeReference } from '../facts/employee-reference';
import { HoursFact } from '../facts/hours-fact';
import { PresenceFacts } from '../facts/presence-facts';
import { SickLeaveDocument } from '../facts/sick-leave-document';
import { isLeaveType } from '../services/is-leave-type';
import { PresenceMonth } from '../value-objects/presence-month';
import {
  AbsenceEntrySnapshot,
  OvertimeEntrySnapshot,
  PresenceSnapshot,
  SickLeaveEntrySnapshot,
} from './presence-snapshot';

export function toPresenceSnapshot(
  presence: Presence,
  employee: EmployeeReference,
  facts: PresenceFacts,
): PresenceSnapshot {
  const absences = absencesOfMonth(presence.month, facts.absences);

  return {
    id: presence.id,
    employeeId: presence.employeeId,
    employeeName: employee.fullName,
    month: presence.month.value,
    workedDays: presence.workedDays,
    leaves: absences
      .filter((absence) => isLeaveType(absence.type))
      .map(toAbsenceEntry),
    absences: absences
      .filter((absence) => !isLeaveType(absence.type))
      .map(toAbsenceEntry),
    sickLeaves: sickLeavesOfMonth(presence.month, facts.sickLeaves),
    overtime: overtimeOfMonth(presence.month, facts.hours),
  };
}

function absencesOfMonth(
  month: PresenceMonth,
  absences: readonly AbsenceFact[],
): AbsenceFact[] {
  return absences
    .filter((absence) => month.overlaps(absence.start, absence.end))
    .sort((first, second) => first.start.value.localeCompare(second.start.value));
}

function sickLeavesOfMonth(
  month: PresenceMonth,
  documents: readonly SickLeaveDocument[],
): SickLeaveEntrySnapshot[] {
  return documents
    .filter((document) => month.contains(document.date))
    .sort((first, second) => first.date.value.localeCompare(second.date.value))
    .map((document) => ({ id: document.id, date: document.date.value }));
}

function overtimeOfMonth(
  month: PresenceMonth,
  facts: readonly HoursFact[],
): OvertimeEntrySnapshot[] {
  return facts
    .filter((fact) => month.contains(fact.date))
    .sort((first, second) => first.date.value.localeCompare(second.date.value))
    .map((fact) => ({
      id: fact.id,
      date: fact.date.value,
      hours: fact.hours,
    }));
}

function toAbsenceEntry(absence: AbsenceFact): AbsenceEntrySnapshot {
  return {
    id: absence.id,
    type: absence.type,
    start: absence.start.value,
    end: absence.end.value,
    days: absence.days,
  };
}
