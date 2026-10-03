export const AuditSubject = {
  COMPANY_NAME: 'company.name',
  COMPANY_CALENDAR_NON_WORKING_WEEKDAYS: 'company.calendar.non_working_weekdays',
  COMPANY_CALENDAR_HOLIDAY: 'company.calendar.holiday',
} as const;

export type AuditSubject = (typeof AuditSubject)[keyof typeof AuditSubject];
