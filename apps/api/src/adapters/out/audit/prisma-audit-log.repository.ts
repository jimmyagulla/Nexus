import {
  AuditAction,
  AuditEvent,
  AuditSubject,
} from '@hexagonal-monorepo-template/domain';
import {
  AuditEventDraft,
  IAuditLogRepository,
} from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import {
  toAuditSnapshot,
  toAuditSnapshotCreate,
} from './prisma-audit-log.mapper';

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async append(event: AuditEventDraft): Promise<void> {
    await this.prisma.auditEvent.create({
      data: {
        companyId: event.companyId,
        actorId: event.actorId,
        occurredAt: event.occurredAt,
        action: event.action,
        subject: event.subject,
        snapshots: {
          create: [
            ...(event.before
              ? [toAuditSnapshotCreate('BEFORE', event.before)]
              : []),
            ...(event.after
              ? [toAuditSnapshotCreate('AFTER', event.after)]
              : []),
          ],
        },
      },
    });
  }

  async listByCompany(companyId: string): Promise<readonly AuditEvent[]> {
    const rows = await this.prisma.auditEvent.findMany({
      where: { companyId },
      include: { snapshots: { include: { daysOfWeek: true } } },
      orderBy: { occurredAt: 'asc' },
    });

    return rows.map((row) => ({
      id: row.id,
      companyId: row.companyId,
      actorId: row.actorId,
      occurredAt: row.occurredAt,
      action: row.action as AuditAction,
      subject: row.subject as AuditSubject,
      before: toAuditSnapshot(
        row.snapshots.find((item) => item.side === 'BEFORE'),
      ),
      after: toAuditSnapshot(
        row.snapshots.find((item) => item.side === 'AFTER'),
      ),
    }));
  }
}
