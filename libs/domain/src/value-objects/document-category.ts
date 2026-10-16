/**
 * Kind of document an employee deposits.
 * Declaration order is the sort order: alphabetical order of the French
 * labels (Arrêt maladie, Autre, Document administratif, Justificatif). The
 * database enum declares its values in the same order.
 */
export const DocumentCategory = {
  SICK_LEAVE: 'SICK_LEAVE',
  OTHER: 'OTHER',
  ADMINISTRATIVE: 'ADMINISTRATIVE',
  PROOF: 'PROOF',
} as const;

export type DocumentCategory =
  (typeof DocumentCategory)[keyof typeof DocumentCategory];

export const DOCUMENT_CATEGORIES: readonly DocumentCategory[] =
  Object.values(DocumentCategory);

const VALUES = new Set<string>(DOCUMENT_CATEGORIES);

export function isDocumentCategory(value: string): value is DocumentCategory {
  return VALUES.has(value);
}
