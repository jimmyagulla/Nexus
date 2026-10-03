/** Valeurs alignées sur l'enum Prisma `AuditSubject` (apps/api/prisma). */
export const AuditSubject = {
  COMPANY_NAME: 'company_name',
  COMPANY_CALENDAR_NON_WORKING_WEEKDAYS:
    'company_calendar_non_working_weekdays',
  COMPANY_CALENDAR_HOLIDAY: 'company_calendar_holiday',
} as const;

export type AuditSubject = (typeof AuditSubject)[keyof typeof AuditSubject];

export function isAuditSubject(value: string): value is AuditSubject {
  return (Object.values(AuditSubject) as string[]).includes(value);
}
