import {
  DocumentCategory,
  DocumentEmitter,
  DocumentList,
  DocumentListCriteria,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import type { DocumentsListState } from '../../controllers/documents.controller';
import { CountLabelPresenter } from './count-label.presenter';
import { DocumentFiltersPresenter } from './document-filters.presenter';

const nothing: DocumentsListState = {
  search: '', categories: [], statuses: [], emitters: [], from: null, to: null, sort: DocumentSort.DATE, direction: 'DESC' as const,
};

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

describe('DocumentFiltersPresenter', () => {
  const presenter = new DocumentFiltersPresenter(new CountLabelPresenter());

  it('ticks the chosen options and keeps the counts of the whole vault', () => {
    const model = presenter.present(
      list,
      { ...nothing, statuses: [DocumentStatus.SEEN] },
      { ...everything, statuses: [DocumentStatus.SEEN] },
    );

    expect(model.statuses).toEqual([
      { id: 'NEW', label: 'Nouveau', count: 2, checked: false },
      { id: 'SEEN', label: 'Consulté', count: 4, checked: true },
      { id: 'PROCESSED', label: 'Pris en compte', count: 0, checked: false },
      { id: 'PENDING', label: 'En attente de prise en compte', count: 1, checked: false },
    ]);
    expect(model.categories.map((option) => option.label)).toEqual([
      'Arrêt maladie', 'Justificatif', 'Document administratif', 'Autre',
    ]);
    expect(model.appliedLabel).toBe('1 filtre appliqué');
  });

  it('says when no filter applies, and how many results the panel shows', () => {
    const model = presenter.present(list, nothing, everything);

    expect(model.appliedLabel).toBe('Aucun filtre appliqué');
    expect(model.showResultsLabel).toBe('Afficher 2 résultats');
  });

  it('keeps every emitter and empty days until some are chosen', () => {
    expect(presenter.present(list, nothing, everything)).toMatchObject({ emitter: 'all', from: '', to: '' });
    expect(
      presenter.present(list, { ...nothing, emitters: [DocumentEmitter.HR], from: '2026-10-01' }, everything),
    ).toMatchObject({ emitter: 'HR', from: '2026-10-01' });
  });
});
