import { Document } from '../entities/document';
import { DocumentListCriteria } from '../read-models/document-list-criteria';
import { DocumentCategory } from '../value-objects/document-category';
import { DocumentEmitter } from '../value-objects/document-emitter';
import { DocumentFileFormat } from '../value-objects/document-file-format';
import { DocumentName } from '../value-objects/document-name';
import { DocumentSort } from '../value-objects/document-sort';
import { DocumentStatus } from '../value-objects/document-status';
import { compareDocuments, countAppliedDocumentFilters, documentPeriodBounds, matchesDocumentListCriteria } from './document-list-rules';

function doc(id: string, overrides: Partial<{
  name: string; category: DocumentCategory; status: DocumentStatus; sizeBytes: number; createdAt: string; uploadedById: string;
}> = {}): Document {
  return new Document({
    id,
    companyId: 'c1',
    ownerId: 'u1',
    uploadedById: overrides.uploadedById ?? 'u1',
    name: DocumentName.parse(overrides.name ?? `Document ${id}`),
    category: overrides.category ?? DocumentCategory.OTHER,
    status: overrides.status ?? DocumentStatus.PENDING,
    format: DocumentFileFormat.PDF,
    sizeBytes: overrides.sizeBytes ?? 100,
    comment: null,
    storageKey: `k-${id}`,
    createdAt: new Date(overrides.createdAt ?? '2026-10-01T10:00:00Z'),
  });
}

const everything: DocumentListCriteria = {
  search: '',
  searchCategories: [],
  searchEmitters: [],
  categories: [],
  statuses: [],
  emitters: [],
  from: null,
  to: null,
  sort: DocumentSort.DATE, direction: 'DESC' as const,
};

describe('matchesDocumentListCriteria', () => {
  it('keeps every document without criteria', () => {
    expect(matchesDocumentListCriteria(doc('1'), everything)).toBe(true);
  });

  it('matches the name whatever its case', () => {
    expect(matchesDocumentListCriteria(doc('1', { name: 'Avis ARRÊT' }), { ...everything, search: 'arrêt' })).toBe(true);
    expect(matchesDocumentListCriteria(doc('1', { name: 'Facture' }), { ...everything, search: 'arrêt' })).toBe(false);
  });

  it('matches a category or an emitter whose label matches the search', () => {
    const sickLeave = doc('1', { name: 'Scan', category: DocumentCategory.SICK_LEAVE });

    expect(matchesDocumentListCriteria(sickLeave, { ...everything, search: 'maladie', searchCategories: [DocumentCategory.SICK_LEAVE] })).toBe(true);
    expect(matchesDocumentListCriteria(sickLeave, { ...everything, search: 'vous', searchEmitters: [DocumentEmitter.SELF] })).toBe(true);
    expect(matchesDocumentListCriteria(sickLeave, { ...everything, search: 'rh', searchEmitters: [DocumentEmitter.HR] })).toBe(false);
  });

  it('keeps the chosen categories, statuses and emitters only', () => {
    const proof = doc('1', { category: DocumentCategory.PROOF, status: DocumentStatus.NEW, uploadedById: 'hr' });

    expect(matchesDocumentListCriteria(proof, { ...everything, categories: [DocumentCategory.PROOF, DocumentCategory.OTHER] })).toBe(true);
    expect(matchesDocumentListCriteria(proof, { ...everything, categories: [DocumentCategory.OTHER] })).toBe(false);
    expect(matchesDocumentListCriteria(proof, { ...everything, statuses: [DocumentStatus.SEEN] })).toBe(false);
    expect(matchesDocumentListCriteria(proof, { ...everything, emitters: [DocumentEmitter.HR] })).toBe(true);
    expect(matchesDocumentListCriteria(proof, { ...everything, emitters: [DocumentEmitter.SELF] })).toBe(false);
  });

  it('includes both ends of the period', () => {
    const first = doc('1', { createdAt: '2026-10-01T00:00:00Z' });
    const last = doc('2', { createdAt: '2026-10-31T23:59:59Z' });
    const october = { ...everything, from: '2026-10-01', to: '2026-10-31' };

    expect(matchesDocumentListCriteria(first, october)).toBe(true);
    expect(matchesDocumentListCriteria(last, october)).toBe(true);
    expect(matchesDocumentListCriteria(doc('3', { createdAt: '2026-11-01T00:00:00Z' }), october)).toBe(false);
  });
});

describe('compareDocuments', () => {
  const ids = (documents: Document[], sort: DocumentSort) =>
    [...documents].sort(compareDocuments(sort, 'DESC')).map((document) => document.id);

  it('puts the most recent first', () => {
    expect(ids([doc('old', { createdAt: '2026-01-01T00:00:00Z' }), doc('new', { createdAt: '2026-10-01T00:00:00Z' })], DocumentSort.DATE)).toEqual(['new', 'old']);
  });

  it('puts the largest first', () => {
    expect(ids([doc('small', { sizeBytes: 1 }), doc('large', { sizeBytes: 9 })], DocumentSort.SIZE)).toEqual(['large', 'small']);
  });

  it('sorts names in descending order', () => {
    expect(ids([doc('a', { name: 'Attestation' }), doc('z', { name: 'Zone' })], DocumentSort.NAME)).toEqual(['z', 'a']);
  });

  it('sorts categories and statuses in descending order of their labels', () => {
    expect(ids([doc('sick', { category: DocumentCategory.SICK_LEAVE }), doc('proof', { category: DocumentCategory.PROOF })], DocumentSort.CATEGORY)).toEqual(['proof', 'sick']);
    expect(ids([doc('seen', { status: DocumentStatus.SEEN }), doc('done', { status: DocumentStatus.PROCESSED })], DocumentSort.STATUS)).toEqual(['done', 'seen']);
  });

  it('reverses the order when ascending, keeping the most recent first among equals', () => {
    const documents = [doc('large', { sizeBytes: 9 }), doc('old', { sizeBytes: 1, createdAt: '2026-01-01T00:00:00Z' }), doc('new', { sizeBytes: 1, createdAt: '2026-02-01T00:00:00Z' })];

    expect([...documents].sort(compareDocuments(DocumentSort.SIZE, 'ASC')).map((d) => d.id)).toEqual(['new', 'old', 'large']);
  });

  it('puts the most recent first among equals', () => {
    expect(ids([doc('old', { sizeBytes: 5, createdAt: '2026-01-01T00:00:00Z' }), doc('new', { sizeBytes: 5, createdAt: '2026-02-01T00:00:00Z' })], DocumentSort.SIZE)).toEqual(['new', 'old']);
  });
});

describe('documentPeriodBounds', () => {
  it('covers the inclusive days, from midnight UTC to the midnight after the last day', () => {
    expect(documentPeriodBounds('2026-10-01', '2026-10-03')).toEqual({
      start: new Date('2026-10-01T00:00:00.000Z'),
      end: new Date('2026-10-04T00:00:00.000Z'),
    });
  });

  it('leaves a missing side unbounded', () => {
    expect(documentPeriodBounds(null, null)).toEqual({ start: null, end: null });
  });
});

describe('countAppliedDocumentFilters', () => {
  const none: DocumentListCriteria = {
    search: 'arrêt', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
    from: null, to: null, sort: DocumentSort.DATE, direction: 'DESC',
  };

  it('ignores the search', () => {
    expect(countAppliedDocumentFilters(none)).toBe(0);
  });

  it('counts one per narrowing group, the period being one group', () => {
    expect(
      countAppliedDocumentFilters({
        ...none,
        categories: [DocumentCategory.PROOF, DocumentCategory.OTHER],
        statuses: [DocumentStatus.NEW],
        emitters: [DocumentEmitter.SELF],
        from: '2026-10-01',
        to: '2026-10-31',
      }),
    ).toBe(4);
  });
});
