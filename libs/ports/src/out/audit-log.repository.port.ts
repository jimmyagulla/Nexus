import { AuditEvent } from '@hexagonal-monorepo-template/domain';

export interface IAuditLogRepository {
  append(event: AuditEvent): Promise<void>;
}

export const IAuditLogRepository = Symbol('IAuditLogRepository');
