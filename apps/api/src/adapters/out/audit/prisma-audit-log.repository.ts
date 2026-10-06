import {
  AuditAction,
  AuditEvent,
  AuditSnapshot,
  AuditSubject,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';
import { IAuditLogRepository } from '@hexagonal-monorepo-template/ports';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async append(event: AuditEvent): Promise<void> {
    await this.prisma.auditEvent.create({
      data: {
        id: event.id,
        companyId: event.companyId,
        actorId: event.actorId,
        occurredAt: event.occurredAt,
        action: event.action,
        subject: event.subject,
        snapshots: {
          create: [
            ...(event.before
              ? [snapshotCreate('BEFORE', event.before, `${event.id}-before`)]
              : []),
            ...(event.after
              ? [snapshotCreate('AFTER', event.after, `${event.id}-after`)]
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
      before: toSnapshot(row.snapshots.find((item) => item.side === 'BEFORE')),
      after: toSnapshot(row.snapshots.find((item) => item.side === 'AFTER')),
    }));
  }
}

function snapshotCreate(
  side: 'BEFORE' | 'AFTER',
  snapshot: AuditSnapshot,
  id: string,
) {
  return {
    id,
    side,
    companyName: snapshot.companyName,
    publicHolidayId: snapshot.publicHolidayId,
    holidayDate: snapshot.holidayDate,
    holidayLabel: snapshot.holidayLabel,
    daysOfWeek: snapshot.daysOfWeek
      ? {
          create: snapshot.daysOfWeek.map((dayOfWeek) => ({ dayOfWeek })),
        }
      : undefined,
  };
}

function toSnapshot(
  row:
    | {
        companyName: string | null;
        publicHolidayId: string | null;
        holidayDate: string | null;
        holidayLabel: string | null;
        daysOfWeek: { dayOfWeek: DayOfWeek }[];
      }
    | undefined,
): AuditSnapshot | null {
  if (row === undefined) {
    return null;
  }

  return {
    companyName: row.companyName ?? undefined,
    publicHolidayId: row.publicHolidayId ?? undefined,
    holidayDate: row.holidayDate ?? undefined,
    holidayLabel: row.holidayLabel ?? undefined,
    daysOfWeek:
      row.daysOfWeek.length > 0
        ? row.daysOfWeek.map((item) => item.dayOfWeek)
        : undefined,
  };
}
