import {
  AuditEvent,
  serializeAuditValue,
} from '@hexagonal-monorepo-template/domain';
import { IAuditLogRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import {
  toPrismaAuditAction,
  toPrismaAuditSubject,
} from './audit-prisma.mapper';

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async append(event: AuditEvent): Promise<void> {
    await this.prisma.auditEvent.create({
      data: {
        companyId: event.companyId,
        action: toPrismaAuditAction(event.action),
        subject: toPrismaAuditSubject(event.subject),
        before: event.before ? serializeAuditValue(event.before) : null,
        after: event.after ? serializeAuditValue(event.after) : null,
        actorId: event.actorId,
        occurredAt: event.occurredAt,
      },
    });
  }
}
