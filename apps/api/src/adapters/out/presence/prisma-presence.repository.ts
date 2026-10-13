import {
  ErrorCode,
  Presence,
  PresenceMonth,
} from '@hexagonal-monorepo-template/domain';
import {
  IPresenceRepository,
  NewPresence,
  PresenceFilter,
} from '@hexagonal-monorepo-template/ports';
import { Prisma } from '../../../infrastructure/prisma/prisma-client';
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toPresence } from './prisma-presence.mapper';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

const presenceInclude = {
  adjustments: { orderBy: { occurredAt: 'asc' } },
} as const;

export class PrismaPresenceRepository implements IPresenceRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async insert(presence: NewPresence): Promise<Presence> {
    try {
      const row = await this.prisma.presence.create({
        data: {
          companyId: presence.companyId,
          employeeId: presence.employeeId,
          month: presence.month.value,
          proposedWorkedDays: presence.workedDays,
          workedDays: presence.workedDays,
        },
        include: presenceInclude,
      });
      return toPresence(row);
    } catch (error) {
      throw this.isUniqueViolation(error)
        ? new Error(ErrorCode.POTENTIAL_DUPLICATE)
        : error;
    }
  }

  async save(presence: Presence): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.updateWorkedDays(tx, presence);
      await this.replaceAdjustments(tx, presence);
    });
  }

  async findById(
    companyId: string,
    presenceId: string,
  ): Promise<Presence | null> {
    const row = await this.prisma.presence.findFirst({
      where: { id: presenceId, companyId },
      include: presenceInclude,
    });
    return row === null ? null : toPresence(row);
  }

  async findByEmployeeAndMonth(
    companyId: string,
    employeeId: string,
    month: PresenceMonth,
  ): Promise<Presence | null> {
    const row = await this.prisma.presence.findUnique({
      where: {
        companyId_employeeId_month: {
          companyId,
          employeeId,
          month: month.value,
        },
      },
      include: presenceInclude,
    });
    return row === null ? null : toPresence(row);
  }

  async list(filter: PresenceFilter): Promise<readonly Presence[]> {
    const rows = await this.prisma.presence.findMany({
      where: {
        companyId: filter.companyId,
        ...(filter.employeeId === undefined
          ? {}
          : { employeeId: filter.employeeId }),
      },
      include: presenceInclude,
    });
    return rows.map(toPresence);
  }

  private async updateWorkedDays(
    tx: Prisma.TransactionClient,
    presence: Presence,
  ): Promise<void> {
    await tx.presence.update({
      where: { id: presence.id },
      data: { workedDays: presence.workedDays },
    });
  }

  private async replaceAdjustments(
    tx: Prisma.TransactionClient,
    presence: Presence,
  ): Promise<void> {
    await tx.presenceAdjustment.deleteMany({
      where: { presenceId: presence.id },
    });
    if (presence.adjustments.length === 0) {
      return;
    }

    await tx.presenceAdjustment.createMany({
      data: presence.adjustments.map((adjustment) => ({
        presenceId: presence.id,
        actorId: adjustment.actorId,
        occurredAt: adjustment.occurredAt,
        before: adjustment.before,
        after: adjustment.after,
      })),
    });
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === UNIQUE_CONSTRAINT_VIOLATION
    );
  }
}
