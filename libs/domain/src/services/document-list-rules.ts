import { Document } from '../entities/document';
import { DocumentListCriteria } from '../read-models/document-list-criteria';
import { DOCUMENT_CATEGORIES } from '../value-objects/document-category';
import { DocumentSort } from '../value-objects/document-sort';
import { DOCUMENT_STATUSES } from '../value-objects/document-status';

/**
 * Whether a document belongs to a list. The search matches the name
 * (case-insensitive), or a category or an emitter whose label matches.
 */
export function matchesDocumentListCriteria(
  document: Document,
  criteria: DocumentListCriteria,
): boolean {
  return (
    matchesSearch(document, criteria) &&
    includedIn(criteria.categories, document.category) &&
    includedIn(criteria.statuses, document.status) &&
    includedIn(criteria.emitters, document.emitter) &&
    withinPeriod(document.createdAt, criteria.from, criteria.to)
  );
}

/**
 * Descending order of a list; the most recent first among equals, then the
 * identifier, so that the order is stable.
 */
export function compareDocuments(
  sort: DocumentSort,
): (left: Document, right: Document) => number {
  return (left, right) =>
    primaryOrder(sort, right, left) ||
    right.createdAt.getTime() - left.createdAt.getTime() ||
    right.id.localeCompare(left.id);
}

function primaryOrder(sort: DocumentSort, a: Document, b: Document): number {
  switch (sort) {
    case DocumentSort.SIZE:
      return a.sizeBytes - b.sizeBytes;
    case DocumentSort.NAME:
      return a.name.value.localeCompare(b.name.value);
    case DocumentSort.CATEGORY:
      return DOCUMENT_CATEGORIES.indexOf(a.category) - DOCUMENT_CATEGORIES.indexOf(b.category);
    case DocumentSort.STATUS:
      return DOCUMENT_STATUSES.indexOf(a.status) - DOCUMENT_STATUSES.indexOf(b.status);
    default:
      return a.createdAt.getTime() - b.createdAt.getTime();
  }
}

function matchesSearch(document: Document, criteria: DocumentListCriteria): boolean {
  const search = criteria.search.trim().toLowerCase();
  return (
    search === '' ||
    document.name.value.toLowerCase().includes(search) ||
    criteria.searchCategories.includes(document.category) ||
    criteria.searchEmitters.includes(document.emitter)
  );
}

function includedIn<T>(allowed: readonly T[], value: T): boolean {
  return allowed.length === 0 || allowed.includes(value);
}

/** `from` and `to` are inclusive calendar days, compared in UTC. */
function withinPeriod(createdAt: Date, from: string | null, to: string | null): boolean {
  const day = createdAt.toISOString().slice(0, 10);
  return (from === null || day >= from) && (to === null || day <= to);
}
