import {
  AuditSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';

export type PrismaAuditSnapshotRow = {
  companyName: string | null;
  publicHolidayId: string | null;
  holidayDate: string | null;
  holidayLabel: string | null;
  expenseReportId?: string | null;
  expenseReportLabel?: string | null;
  expenseReportStatus?: string | null;
  expenseReportTotalCents?: number | null;
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
    expenseReportId: snapshot.expenseReportId,
    expenseReportLabel: snapshot.expenseReportLabel,
    expenseReportStatus: snapshot.expenseReportStatus,
    expenseReportTotalCents:
      snapshot.expenseReportTotal === undefined
        ? undefined
        : Math.round(snapshot.expenseReportTotal * 100),
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
    expenseReportId: row.expenseReportId ?? undefined,
    expenseReportLabel: row.expenseReportLabel ?? undefined,
    expenseReportStatus: row.expenseReportStatus ?? undefined,
    expenseReportTotal:
      row.expenseReportTotalCents == null
        ? undefined
        : row.expenseReportTotalCents / 100,
    daysOfWeek:
      row.daysOfWeek.length > 0
        ? row.daysOfWeek.map((item) => item.dayOfWeek)
        : undefined,
  };
}
