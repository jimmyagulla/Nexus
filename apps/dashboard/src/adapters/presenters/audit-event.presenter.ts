import {
  AuditAction,
  AuditSubject,
  type AuditValue,
} from '@hexagonal-monorepo-template/domain';

export type AuditEventView = {
  action: AuditAction;
  subject: AuditSubject;
  before: AuditValue | null;
  after: AuditValue | null;
  actorLabel?: string;
};

type LineFormatter = (event: AuditEventView) => string;

function actorOf(event: AuditEventView): string {
  return event.actorLabel ?? "L'employeur";
}

function holidayLabel(value: AuditValue | null): string {
  return value?.kind === AuditSubject.COMPANY_CALENDAR_HOLIDAY
    ? `${value.label} (${value.date})`
    : '';
}

const LINE_BY_EVENT: Partial<Record<`${AuditAction}:${AuditSubject}`, LineFormatter>> = {
  [`${AuditAction.MODIFICATION}:${AuditSubject.COMPANY_NAME}`]: (event) => {
    const before =
      event.before?.kind === AuditSubject.COMPANY_NAME ? event.before.name : '';
    const after =
      event.after?.kind === AuditSubject.COMPANY_NAME ? event.after.name : '';
    return `${actorOf(event)} a modifié le nom de l'entreprise (${before} → ${after}).`;
  },
  [`${AuditAction.MODIFICATION}:${AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS}`]:
    (event) => `${actorOf(event)} a modifié les jours habituels non travaillés.`,
  [`${AuditAction.ADDITION}:${AuditSubject.COMPANY_CALENDAR_HOLIDAY}`]: (event) =>
    `${actorOf(event)} a ajouté le jour férié ${holidayLabel(event.after)}.`,
  [`${AuditAction.DELETION}:${AuditSubject.COMPANY_CALENDAR_HOLIDAY}`]: (event) =>
    `${actorOf(event)} a retiré le jour férié ${holidayLabel(event.before)}.`,
  [`${AuditAction.MODIFICATION}:${AuditSubject.COMPANY_CALENDAR_HOLIDAY}`]: (event) =>
    `${actorOf(event)} a modifié le jour férié ${holidayLabel(event.before)}.`,
};

export function formatAuditEventLine(event: AuditEventView): string {
  const format = LINE_BY_EVENT[`${event.action}:${event.subject}`];
  return format ? format(event) : `${actorOf(event)} — ${event.action} — ${event.subject}`;
}
