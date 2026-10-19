import {
  DocumentCategory,
  DocumentEmitter,
  DocumentList,
  DocumentListCriteria,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import { CountLabelPresenter } from './count-label.presenter';
import { DocumentListSummaryPresenter } from './document-list-summary.presenter';

const everything: DocumentListCriteria = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE, direction: 'DESC' as const,
};

const list: DocumentList = {
  items: [
    {
      id: 'd1', name: 'Arrêt du 2 octobre', category: DocumentCategory.SICK_LEAVE, status: DocumentStatus.PENDING,
      format: 'PDF', sizeBytes: 192_512, emitter: DocumentEmitter.SELF, comment: null, createdAt: '2026-10-03T10:24:00.000Z',
    },
    {
      id: 'd2', name: 'Notice', category: DocumentCategory.ADMINISTRATIVE, status: DocumentStatus.NEW,
      format: 'JPEG', sizeBytes: 1_468_006, emitter: DocumentEmitter.HR, comment: null, createdAt: '2026-01-05T09:00:00.000Z',
    },
  ],
  total: 7,
  categoryCounts: { SICK_LEAVE: 3, OTHER: 1, ADMINISTRATIVE: 2, PROOF: 1 },
  statusCounts: { SEEN: 4, PENDING: 1, NEW: 2, PROCESSED: 0 },
};

const narrowed: DocumentListCriteria = {
  ...everything,
  categories: [DocumentCategory.PROOF, DocumentCategory.SICK_LEAVE],
  statuses: [DocumentStatus.NEW],
  emitters: [DocumentEmitter.SELF],
  from: '2026-10-01',
};

describe('DocumentListSummaryPresenter', () => {
  const presenter = new DocumentListSummaryPresenter(new CountLabelPresenter());

  it('counts the whole vault when nothing narrows it', () => {
    expect(presenter.present(list, everything)).toMatchObject({
      appliedFilterCount: 0,
      resultSummary: '7 documents',
      canClearFilters: false,
    });
  });

  it('counts the results among the vault once filters apply', () => {
    expect(presenter.present(list, narrowed)).toMatchObject({
      appliedFilterCount: 4,
      resultSummary: '2 résultats sur 7 ·',
      canClearFilters: true,
    });
  });

  it('tells an empty vault from an empty search', () => {
    expect(presenter.present({ ...list, items: [], total: 0 }, everything).emptyMessage).toBe(
      "Vous n'avez encore aucun document.",
    );
    expect(presenter.present({ ...list, items: [] }, { ...everything, search: 'zz' }).emptyMessage).toBe(
      'Aucun document ne correspond à votre recherche.',
    );
  });
});
