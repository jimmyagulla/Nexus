import { AuditEvent } from '@hexagonal-monorepo-template/domain';
import {
  AuditEventDraft,
  IAuditLogRepository,
} from '@hexagonal-monorepo-template/ports';

export class InMemoryAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly events = new Map<string, AuditEvent>()) {}

  async append(event: AuditEventDraft): Promise<void> {
    const stored: AuditEvent = {
      ...event,
      id: globalThis.crypto.randomUUID(),
    };
    this.events.set(stored.id, stored);
  }

  async listByCompany(companyId: string): Promise<readonly AuditEvent[]> {
    return [...this.events.values()].filter(
      (event) => event.companyId === companyId,
    );
  }
}
