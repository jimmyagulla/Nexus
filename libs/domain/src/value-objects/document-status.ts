/**
 * Handling state of a document.
 * Declaration order is the sort order: alphabetical order of the French
 * labels (Consulté, En attente de prise en compte, Nouveau, Pris en compte).
 * The database enum declares its values in the same order.
 */
export const DocumentStatus = {
  SEEN: 'SEEN',
  PENDING: 'PENDING',
  NEW: 'NEW',
  PROCESSED: 'PROCESSED',
} as const;

export type DocumentStatus =
  (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const DOCUMENT_STATUSES: readonly DocumentStatus[] =
  Object.values(DocumentStatus);

const VALUES = new Set<string>(DOCUMENT_STATUSES);

export function isDocumentStatus(value: string): value is DocumentStatus {
  return VALUES.has(value);
}
