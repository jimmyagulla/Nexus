import {
  AuditEvent,
  AuditSubject,
  type AuditValue,
} from '@hexagonal-monorepo-template/domain';
import { IAuditLogRepository } from '@hexagonal-monorepo-template/ports';
import { AuditSide } from '../../../infrastructure/prisma/generated';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import {
  toPrismaAuditAction,
  toPrismaAuditSubject,
} from './audit-prisma.mapper';
import { toPrismaWeekday } from '../weekday-prisma.mapper';

function snapshotData(value: AuditValue) {
  if (value.kind === AuditSubject.COMPANY_NAME) {
    return { companyName: value.name };
  }
  if (value.kind === AuditSubject.COMPANY_CALENDAR_HOLIDAY) {
    return {
      holidayId: value.id,
      holidayDate: value.date,
      holidayLabel: value.label,
    };
  }
  return {
    weekdays: {
      create: value.weekdays.map((weekday) => ({
        weekday: toPrismaWeekday(weekday),
      })),
    },
  };
}

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async append(event: AuditEvent): Promise<void> {
    const snapshots = [
      event.before === null
        ? null
        : { side: AuditSide.BEFORE, ...snapshotData(event.before) },
      event.after === null
        ? null
        : { side: AuditSide.AFTER, ...snapshotData(event.after) },
    ].filter((snapshot) => snapshot !== null);

    await this.prisma.auditEvent.create({
      data: {
        companyId: event.companyId,
        action: toPrismaAuditAction(event.action),
        subject: toPrismaAuditSubject(event.subject),
        actorId: event.actorId,
        occurredAt: event.occurredAt,
        snapshots: { create: snapshots },
      },
    });
  }
}
