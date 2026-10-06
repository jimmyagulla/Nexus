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

export class AuditEventPresenter {
  presentMany(events: readonly AuditEventView[]): string[] {
    return events.map((event) => this.present(event));
  }

  present(event: AuditEventView): string {
    const line = this.lineFor(event);
    if (line !== null) {
      return line;
    }
    return `${this.actorOf(event)} — ${event.action} — ${event.subject}`;
  }

  private lineFor(event: AuditEventView): string | null {
    const key = `${event.action}:${event.subject}`;
    if (key === `${AuditAction.MODIFICATION}:${AuditSubject.COMPANY_NAME}`) {
      return this.companyNameLine(event);
    }
    if (
      key ===
      `${AuditAction.MODIFICATION}:${AuditSubject.COMPANY_CALENDAR_NON_WORKING_WEEKDAYS}`
    ) {
      return `${this.actorOf(event)} a modifié les jours habituels non travaillés.`;
    }
    if (key === `${AuditAction.ADDITION}:${AuditSubject.COMPANY_CALENDAR_HOLIDAY}`) {
      return `${this.actorOf(event)} a ajouté le jour férié ${this.holidayLabel(event.after)}.`;
    }
    if (key === `${AuditAction.DELETION}:${AuditSubject.COMPANY_CALENDAR_HOLIDAY}`) {
      return `${this.actorOf(event)} a retiré le jour férié ${this.holidayLabel(event.before)}.`;
    }
    if (
      key === `${AuditAction.MODIFICATION}:${AuditSubject.COMPANY_CALENDAR_HOLIDAY}`
    ) {
      return `${this.actorOf(event)} a modifié le jour férié ${this.holidayLabel(event.before)}.`;
    }
    return null;
  }

  private companyNameLine(event: AuditEventView): string {
    const before =
      event.before?.kind === AuditSubject.COMPANY_NAME ? event.before.name : '';
    const after =
      event.after?.kind === AuditSubject.COMPANY_NAME ? event.after.name : '';
    return `${this.actorOf(event)} a modifié le nom de l'entreprise (${before} → ${after}).`;
  }

  private actorOf(event: AuditEventView): string {
    return event.actorLabel ?? "L'employeur";
  }

  private holidayLabel(value: AuditValue | null): string {
    return value?.kind === AuditSubject.COMPANY_CALENDAR_HOLIDAY
      ? `${value.label} (${value.date})`
      : '';
  }
}
