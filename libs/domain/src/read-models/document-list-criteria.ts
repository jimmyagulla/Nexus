import { DocumentCategory } from '../value-objects/document-category';
import { DocumentEmitter } from '../value-objects/document-emitter';
import {
  DocumentSort,
  DocumentSortDirection,
} from '../value-objects/document-sort';
import { DocumentStatus } from '../value-objects/document-status';

/**
 * What a documents list shows. Empty lists mean "no restriction".
 * `search` matches the name; `searchCategories` and `searchEmitters` are the
 * categories and emitters whose label matches the same search, resolved by
 * the caller that knows the labels.
 */
export type DocumentListCriteria = {
  search: string;
  searchCategories: readonly DocumentCategory[];
  searchEmitters: readonly DocumentEmitter[];
  categories: readonly DocumentCategory[];
  statuses: readonly DocumentStatus[];
  emitters: readonly DocumentEmitter[];
  /** Inclusive calendar days (YYYY-MM-DD), or null. */
  from: string | null;
  to: string | null;
  sort: DocumentSort;
  direction: DocumentSortDirection;
};
