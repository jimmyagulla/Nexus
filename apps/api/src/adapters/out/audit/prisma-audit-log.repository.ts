import { AuditEntry } from '@hexagonal-monorepo-template/domain';
import { IAuditLogRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async append(entry: AuditEntry): Promise<void> {
    await this.prisma.auditEvent.create({
      data: {
        companyId: entry.companyId,
        action: entry.action,
        objectLabel: entry.objectLabel,
        readablePhrase: entry.readablePhrase,
        before: entry.before,
        after: entry.after,
        occurredAt: entry.occurredAt,
      },
    });
  }
}
