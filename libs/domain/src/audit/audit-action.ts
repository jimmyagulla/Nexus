/** Valeurs alignées sur l'enum Prisma `AuditAction` (apps/api/prisma). */
export const AuditAction = {
  MODIFICATION: 'modification',
  AJOUT: 'ajout',
  SUPPRESSION: 'suppression',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];

export function isAuditAction(value: string): value is AuditAction {
  return (Object.values(AuditAction) as string[]).includes(value);
}
