import { AuditEvent } from '@hexagonal-monorepo-template/domain';

export type AuditEventDraft = Omit<AuditEvent, 'id'>;

export interface IAuditLogRepository {
  append(event: AuditEventDraft): Promise<void>;
  listByCompany(companyId: string): Promise<readonly AuditEvent[]>;
}

export const IAuditLogRepository = Symbol('IAuditLogRepository');
