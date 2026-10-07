import {
  AuditSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';

export type PrismaAuditSnapshotRow = {
  companyName: string | null;
  publicHolidayId: string | null;
  holidayDate: string | null;
  holidayLabel: string | null;
  daysOfWeek: { dayOfWeek: DayOfWeek }[];
};

export function toAuditSnapshotCreate(
  side: 'BEFORE' | 'AFTER',
  snapshot: AuditSnapshot,
) {
  return {
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

export function toAuditSnapshot(
  row: PrismaAuditSnapshotRow | undefined,
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
