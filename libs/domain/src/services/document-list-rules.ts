import { Document } from '../entities/document';
import { DocumentListCriteria } from '../read-models/document-list-criteria';
import { DocumentList } from '../read-models/document-list';
import { toDocumentSummary } from '../read-models/document-summary';
import {
  DOCUMENT_CATEGORIES,
  DocumentCategory,
} from '../value-objects/document-category';
import {
  DocumentSort,
  DocumentSortDirection,
} from '../value-objects/document-sort';
import {
  DOCUMENT_STATUSES,
  DocumentStatus,
} from '../value-objects/document-status';

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
 * The list of one owner's documents for the criteria: the matching ones in
 * order, and the counts the filters show, which ignore the criteria.
 */
export function toDocumentList(
  owned: readonly Document[],
  criteria: DocumentListCriteria,
): DocumentList {
  return {
    items: owned
      .filter((document) => matchesDocumentListCriteria(document, criteria))
      .sort(compareDocuments(criteria.sort, criteria.direction))
      .map(toDocumentSummary),
    total: owned.length,
    categoryCounts: countBy(DOCUMENT_CATEGORIES, owned, (document) => document.category),
    statusCounts: countBy(DOCUMENT_STATUSES, owned, (document) => document.status),
  };
}

function countBy<K extends DocumentCategory | DocumentStatus>(
  keys: readonly K[],
  documents: readonly Document[],
  keyOf: (document: Document) => K,
): Record<K, number> {
  return Object.fromEntries(
    keys.map((key) => [key, documents.filter((document) => keyOf(document) === key).length]),
  ) as Record<K, number>;
}

/**
 * Order of a list along a column, in either direction; the most recent first
 * among equals, then the identifier, so that the order is stable.
 */
export function compareDocuments(
  sort: DocumentSort,
  direction: DocumentSortDirection,
): (left: Document, right: Document) => number {
  const sign = direction === DocumentSortDirection.ASC ? 1 : -1;
  return (left, right) =>
    sign * primaryOrder(sort, left, right) ||
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

/** Instants covered by a period: from `start` included to `end` excluded; null is unbounded. */
export type DocumentPeriodBounds = { start: Date | null; end: Date | null };

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * `from` and `to` are inclusive calendar days (YYYY-MM-DD), in UTC: the period
 * starts at midnight of `from` and ends at midnight of the day after `to`.
 */
export function documentPeriodBounds(
  from: string | null,
  to: string | null,
): DocumentPeriodBounds {
  return {
    start: from === null ? null : startOfDay(from),
    end: to === null ? null : new Date(startOfDay(to).getTime() + DAY_MS),
  };
}

function startOfDay(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

function withinPeriod(createdAt: Date, from: string | null, to: string | null): boolean {
  const { start, end } = documentPeriodBounds(from, to);
  return (start === null || createdAt >= start) && (end === null || createdAt < end);
}
