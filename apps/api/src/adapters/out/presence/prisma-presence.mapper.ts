import { Presence, PresenceMonth } from '@hexagonal-monorepo-template/domain';

export type PrismaPresenceRow = {
  id: string;
  companyId: string;
  employeeId: string;
  month: string;
  workedDays: number;
};

export function toPresence(row: PrismaPresenceRow): Presence {
  return new Presence(
    row.id,
    row.companyId,
    row.employeeId,
    PresenceMonth.parse(row.month),
    row.workedDays,
  );
}
