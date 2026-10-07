import { AuditEvent } from '@hexagonal-monorepo-template/domain';
import { IAuditLogRepository } from '@hexagonal-monorepo-template/ports';

export class InMemoryAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly events = new Map<string, AuditEvent>()) {}

  async append(event: AuditEvent): Promise<void> {
    this.events.set(event.id, event);
  }

  async listByCompany(companyId: string): Promise<readonly AuditEvent[]> {
    return [...this.events.values()].filter(
      (event) => event.companyId === companyId,
    );
  }
}
