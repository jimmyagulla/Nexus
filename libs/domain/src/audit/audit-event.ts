import { type AuditAction } from './audit-action';
import { type AuditSubject } from './audit-subject';
import { type AuditValue } from './audit-value';

export class AuditEvent {
  constructor(
    readonly companyId: string,
    readonly action: AuditAction,
    readonly subject: AuditSubject,
    readonly before: AuditValue | null,
    readonly after: AuditValue | null,
    readonly occurredAt: Date,
    readonly actorId: string | null = null,
  ) {}
}
