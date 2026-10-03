import {
  AuditAction,
  AuditEvent,
  AuditSubject,
  AuditValue,
} from '@hexagonal-monorepo-template/domain';
import { IAuditLogRepository } from '@hexagonal-monorepo-template/ports';

export function appendCompanyAudit(
  auditLog: IAuditLogRepository,
  companyId: string,
  action: AuditAction,
  subject: AuditSubject,
  before: AuditValue | null,
  after: AuditValue | null,
): Promise<void> {
  return auditLog.append(
    new AuditEvent(companyId, action, subject, before, after, new Date()),
  );
}
