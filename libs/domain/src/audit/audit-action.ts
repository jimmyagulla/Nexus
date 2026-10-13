export const AuditAction = {
  MODIFICATION: 'MODIFICATION',
  ADDITION: 'ADDITION',
  DELETION: 'DELETION',
  CONNECTION: 'CONNECTION',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
