/** Orderings of a documents list. Every ordering is descending. */
export const DocumentSort = {
  DATE: 'DATE',
  SIZE: 'SIZE',
  NAME: 'NAME',
  CATEGORY: 'CATEGORY',
  STATUS: 'STATUS',
} as const;

export type DocumentSort = (typeof DocumentSort)[keyof typeof DocumentSort];

export const DOCUMENT_SORTS: readonly DocumentSort[] = Object.values(DocumentSort);

export const DEFAULT_DOCUMENT_SORT: DocumentSort = DocumentSort.DATE;

const VALUES = new Set<string>(DOCUMENT_SORTS);

export function isDocumentSort(value: string): value is DocumentSort {
  return VALUES.has(value);
}
