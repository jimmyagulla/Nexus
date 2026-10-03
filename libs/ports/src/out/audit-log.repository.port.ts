import { AuditEntry } from '@hexagonal-monorepo-template/domain';

export interface IAuditLogRepository {
  append(entry: AuditEntry): Promise<void>;
}

export const IAuditLogRepository = Symbol('IAuditLogRepository');
