/** Values match the Prisma enum `AuditAction`. */
export const AuditAction = {
  MODIFICATION: 'MODIFICATION',
  ADDITION: 'ADDITION',
  DELETION: 'DELETION',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export function isAuditAction(value: string): value is AuditAction {
  return (Object.values(AuditAction) as string[]).includes(value);
}
