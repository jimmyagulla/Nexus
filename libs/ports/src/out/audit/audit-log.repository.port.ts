import { AuditEvent } from '@hexagonal-monorepo-template/domain';

export interface IAuditLogRepository {
  append(event: AuditEvent): Promise<void>;
  listByCompany(companyId: string): Promise<readonly AuditEvent[]>;
}

export const IAuditLogRepository = Symbol('IAuditLogRepository');
