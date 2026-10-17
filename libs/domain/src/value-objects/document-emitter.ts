/**
 * Who deposited a document, seen from its owner: the owner themself, or HR.
 * An emitter is a person for now; HR groups will come later.
 */
export const DocumentEmitter = {
  SELF: 'SELF',
  HR: 'HR',
} as const;

export type DocumentEmitter =
  (typeof DocumentEmitter)[keyof typeof DocumentEmitter];

export const DOCUMENT_EMITTERS: readonly DocumentEmitter[] =
  Object.values(DocumentEmitter);

const VALUES = new Set<string>(DOCUMENT_EMITTERS);

export function isDocumentEmitter(value: string): value is DocumentEmitter {
  return VALUES.has(value);
}
