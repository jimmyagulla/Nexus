/** Actions du contrat d'audit (referentiel contrats-partages). */
export const AuditAction = {
  MODIFICATION: 'modification',
  AJOUT: 'ajout',
  SUPPRESSION: 'suppression',
} as const;

export type AuditAction = (typeof AuditAction)[keyof typeof AuditAction];
