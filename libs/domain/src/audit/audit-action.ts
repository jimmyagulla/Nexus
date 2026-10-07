export const AuditAction = {
  MODIFICATION: 'MODIFICATION',
  ADDITION: 'ADDITION',
  DELETION: 'DELETION',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
