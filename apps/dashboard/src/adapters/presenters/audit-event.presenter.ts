import {
  AuditAction,
  AuditSubject,
  type AuditEvent,
  type AuditValue,
} from '@hexagonal-monorepo-template/domain';

/** Entrée presenter : même forme qu’un événement domaine (sans persistance). */
export type AuditEventView = Pick<
  AuditEvent,
  'action' | 'subject' | 'before' | 'after' | 'occurredAt'
> & { actorLabel?: string };

export function formatAuditEventLine(event: AuditEventView): string {
  const actor = event.actorLabel ?? "L'employeur";
  if (
    event.subject === AuditSubject.COMPANY_NAME &&
    event.action === AuditAction.MODIFICATION &&
    event.before?.kind === AuditSubject.COMPANY_NAME &&
    event.after?.kind === AuditSubject.COMPANY_NAME
  ) {
    return `${actor} a modifié le nom de l'entreprise (${event.before.name} → ${event.after.name}).`;
  }
  if (
    event.subject === AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS &&
    event.action === AuditAction.MODIFICATION
  ) {
    return `${actor} a modifié les jours habituels non travaillés.`;
  }
  if (
    event.subject === AuditSubject.COMPANY_CALENDAR_HOLIDAY &&
    event.action === AuditAction.AJOUT &&
    event.after?.kind === AuditSubject.COMPANY_CALENDAR_HOLIDAY
  ) {
    return `${actor} a ajouté le jour férié ${event.after.label} (${event.after.date}).`;
  }
  if (
    event.subject === AuditSubject.COMPANY_CALENDAR_HOLIDAY &&
    event.action === AuditAction.SUPPRESSION &&
    event.before?.kind === AuditSubject.COMPANY_CALENDAR_HOLIDAY
  ) {
    return `${actor} a retiré le jour férié ${event.before.label} (${event.before.date}).`;
  }
  if (
    event.subject === AuditSubject.COMPANY_CALENDAR_HOLIDAY &&
    event.action === AuditAction.MODIFICATION &&
    event.before?.kind === AuditSubject.COMPANY_CALENDAR_HOLIDAY &&
    event.after?.kind === AuditSubject.COMPANY_CALENDAR_HOLIDAY
  ) {
    return `${actor} a modifié le jour férié ${event.before.label}.`;
  }
  return `${actor} — ${event.action} — ${event.subject}`;
}

export function formatAuditValueSummary(value: AuditValue): string {
  switch (value.kind) {
    case AuditSubject.COMPANY_NAME:
      return value.name;
    case AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS:
      return value.weekdays.join(',');
    case AuditSubject.COMPANY_CALENDAR_HOLIDAY:
      return `${value.date} — ${value.label}`;
    default:
      return value.kind;
  }
}
