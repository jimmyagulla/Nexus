/** Values match the Prisma enum `AuditSubject`. */
export const AuditSubject = {
  COMPANY_NAME: 'COMPANY_NAME',
  COMPANY_CALENDAR_NON_WORKING_WEEKDAYS:
    'COMPANY_CALENDAR_NON_WORKING_WEEKDAYS',
  COMPANY_CALENDAR_HOLIDAY: 'COMPANY_CALENDAR_HOLIDAY',
} as const;

export type AuditSubject = (typeof AuditSubject)[keyof typeof AuditSubject];

export function isAuditSubject(value: string): value is AuditSubject {
  return (Object.values(AuditSubject) as string[]).includes(value);
}
