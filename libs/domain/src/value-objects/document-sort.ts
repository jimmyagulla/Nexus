/** Columns a documents list can be ordered by. */
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

/** Direction of an ordering. */
export const DocumentSortDirection = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

export type DocumentSortDirection =
  (typeof DocumentSortDirection)[keyof typeof DocumentSortDirection];

export const DOCUMENT_SORT_DIRECTIONS: readonly DocumentSortDirection[] =
  Object.values(DocumentSortDirection);

/** Without a chosen ordering, the most recent documents come first. */
export const DEFAULT_DOCUMENT_SORT_DIRECTION: DocumentSortDirection =
  DocumentSortDirection.DESC;
