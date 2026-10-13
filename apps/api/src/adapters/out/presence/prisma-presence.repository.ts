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
import { PrismaDb } from '../../../infrastructure/prisma/prisma-db.port';
import { toPresence } from './prisma-presence.mapper';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

export class PrismaPresenceRepository implements IPresenceRepository {
  constructor(private readonly prisma: PrismaDb) {}

  async insert(presence: NewPresence): Promise<Presence> {
    try {
      const row = await this.prisma.presence.create({
        data: {
          companyId: presence.companyId,
          employeeId: presence.employeeId,
          month: presence.month.value,
          workedDays: presence.workedDays,
        },
      });
      return toPresence(row);
    } catch (error) {
      throw this.isUniqueViolation(error)
        ? new Error(ErrorCode.POTENTIAL_DUPLICATE)
        : error;
    }
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
    });
    return row === null ? null : toPresence(row);
  }

  async list(filter: PresenceFilter): Promise<readonly Presence[]> {
    const rows = await this.prisma.presence.findMany({
      where: { companyId: filter.companyId },
    });
    return rows.map(toPresence);
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
