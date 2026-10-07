export const AuditSubject = {
  COMPANY_NAME: 'COMPANY_NAME',
  COMPANY_NON_WORKING_WEEKDAY: 'COMPANY_NON_WORKING_WEEKDAY',
  COMPANY_PUBLIC_HOLIDAY: 'COMPANY_PUBLIC_HOLIDAY',
} as const;

export type AuditSubject = (typeof AuditSubject)[keyof typeof AuditSubject];
