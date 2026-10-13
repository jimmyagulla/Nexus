export const AuditAction = {
  MODIFICATION: 'MODIFICATION',
  ADDITION: 'ADDITION',
  DELETION: 'DELETION',
  TRANSMISSION: 'TRANSMISSION',
  VALIDATION: 'VALIDATION',
  REFUSAL: 'REFUSAL',
  STATUS_CHANGE: 'STATUS_CHANGE',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
