import {
  DocumentCategory,
  DocumentEmitter,
  DocumentList,
  DocumentListCriteria,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import type { DocumentsListState } from '../../controllers/documents.controller';
import { DocumentsPresenter } from './documents.presenter';

const nothing: DocumentsListState = {
  search: '', categories: [], statuses: [], emitter: null, from: '', to: '', sort: DocumentSort.DATE,
};
const everything: DocumentListCriteria = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE,
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

describe('DocumentsPresenter', () => {
  const presenter = new DocumentsPresenter();

  it('presents each document as a row of the table', () => {
    expect(presenter.present(list, nothing, everything).documents).toEqual([
      {
        id: 'd1', icon: 'ri-first-aid-kit-line', name: 'Arrêt du 2 octobre', category: 'Arrêt maladie', date: '03/10/2026',
        format: 'PDF', size: '188 Ko', emitter: 'Vous', status: { label: 'En attente de prise en compte', tone: 'warning' },
      },
      {
        id: 'd2', icon: 'ri-file-text-line', name: 'Notice', category: 'Document administratif', date: '05/01/2026',
        format: 'JPG', size: '1,4 Mo', emitter: 'Service RH', status: { label: 'Nouveau', tone: 'info' },
      },
    ]);
  });

  it('counts the whole vault when nothing narrows it', () => {
    const model = presenter.present(list, nothing, everything);

    expect(model.resultSummary).toBe('7 documents');
    expect(model.appliedFilterCount).toBe(0);
    expect(model.canClearFilters).toBe(false);
    expect(model.filters.appliedLabel).toBe('Aucun filtre appliqué');
  });

  it('shows one removable chip per applied filter group', () => {
    const state: DocumentsListState = {
      ...nothing,
      categories: [DocumentCategory.PROOF, DocumentCategory.SICK_LEAVE],
      statuses: [DocumentStatus.NEW],
      emitter: DocumentEmitter.SELF,
      from: '01/10/2026',
    };

    const model = presenter.present(list, state, { ...everything, from: '2026-10-01' });

    expect(model.activeFilters).toEqual([
      { key: 'categories', label: 'Catégorie', value: 'Arrêt maladie, Justificatif' },
      { key: 'statuses', label: 'Statut', value: 'Nouveau' },
      { key: 'period', label: 'Période', value: 'à partir du 01/10/2026' },
      { key: 'emitter', label: 'Émetteur', value: 'Vous' },
    ]);
    expect(model.resultSummary).toBe('2 résultats sur 7 ·');
    expect(model.filters.appliedLabel).toBe('4 filtres appliqués');
    expect(model.filters.showResultsLabel).toBe('Afficher 2 résultats');
    expect(model.canClearFilters).toBe(true);
  });

  it('ignores a period typed only halfway', () => {
    const model = presenter.present(list, { ...nothing, from: '01/1' }, everything);

    expect(model.activeFilters).toEqual([]);
  });

  it('ticks the chosen options and keeps the counts of the whole vault', () => {
    const model = presenter.present(list, { ...nothing, statuses: [DocumentStatus.SEEN] }, everything);

    expect(model.filters.statuses).toEqual([
      { id: 'NEW', label: 'Nouveau', count: 2, checked: false },
      { id: 'SEEN', label: 'Consulté', count: 4, checked: true },
      { id: 'PROCESSED', label: 'Pris en compte', count: 0, checked: false },
      { id: 'PENDING', label: 'En attente de prise en compte', count: 1, checked: false },
    ]);
    expect(model.filters.categories.map((option) => option.label)).toEqual([
      'Arrêt maladie', 'Justificatif', 'Document administratif', 'Autre',
    ]);
  });

  it('names the current ordering and offers the others', () => {
    const model = presenter.present(list, { ...nothing, sort: DocumentSort.SIZE }, everything);

    expect(model.sort.label).toBe("taille, plus lourd d'abord");
    expect(model.sort.options.filter((option) => option.selected).map((option) => option.value)).toEqual([DocumentSort.SIZE]);
  });

  it('tells an empty vault from an empty search', () => {
    const empty = { ...list, items: [], total: 0 };

    expect(presenter.present(empty, nothing, everything).emptyMessage).toBe("Vous n'avez encore aucun document.");
    expect(presenter.present({ ...list, items: [] }, { ...nothing, search: 'zz' }, everything).emptyMessage).toBe(
      'Aucun document ne correspond à votre recherche.',
    );
  });
});
