import {
  Presence,
  PresenceMonth,
  WorkedDaysAdjustment,
} from '@hexagonal-monorepo-template/domain';

export type PrismaPresenceRow = {
  id: string;
  companyId: string;
  employeeId: string;
  month: string;
  proposedWorkedDays: number;
  workedDays: number;
  adjustments: {
    actorId: string;
    occurredAt: Date;
    before: number;
    after: number;
  }[];
};

export function toPresence(row: PrismaPresenceRow): Presence {
  return new Presence(
    row.id,
    row.companyId,
    row.employeeId,
    PresenceMonth.parse(row.month),
    row.workedDays,
    row.proposedWorkedDays,
    row.adjustments.map(
      (adjustment) =>
        new WorkedDaysAdjustment(
          adjustment.actorId,
          adjustment.occurredAt,
          adjustment.before,
          adjustment.after,
        ),
    ),
  );
}
