import { AuditAction } from './audit-action';
import { AuditSnapshot } from './audit-snapshot';
import { AuditSubject } from './audit-subject';

export type AuditEvent = {
  id: string;
  companyId: string;
  actorId: string;
  occurredAt: Date;
  action: AuditAction;
  subject: AuditSubject;
  before: AuditSnapshot | null;
  after: AuditSnapshot | null;
};
