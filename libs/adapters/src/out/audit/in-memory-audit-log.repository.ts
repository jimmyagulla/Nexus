import { AuditEvent } from '@hexagonal-monorepo-template/domain';
import {
  AuditEventDraft,
  IAuditLogRepository,
  IIdGenerator,
} from '@hexagonal-monorepo-template/ports';

export class InMemoryAuditLogRepository implements IAuditLogRepository {
  constructor(
    private readonly ids: IIdGenerator,
    private readonly events = new Map<string, AuditEvent>(),
  ) {}

  async append(event: AuditEventDraft): Promise<void> {
    const stored: AuditEvent = {
      ...event,
      id: this.ids.next(),
    };
    this.events.set(stored.id, stored);
  }

  async listByCompany(companyId: string): Promise<readonly AuditEvent[]> {
    return [...this.events.values()].filter(
      (event) => event.companyId === companyId,
    );
  }
}
