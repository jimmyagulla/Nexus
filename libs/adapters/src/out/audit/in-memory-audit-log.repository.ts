import { AuditEvent } from '@hexagonal-monorepo-template/domain';
import { IAuditLogRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryAuditLogRepository implements IAuditLogRepository {
  readonly entries: AuditEvent[] = [];

  async append(event: AuditEvent): Promise<void> {
    this.entries.push(event);
  }
}
