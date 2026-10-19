import {
  DocumentCategory,
  DocumentEmitter,
  DocumentListCriteria,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import { DocumentActiveFiltersPresenter } from './document-active-filters.presenter';

const everything: DocumentListCriteria = {
  search: '', searchCategories: [], searchEmitters: [], categories: [], statuses: [], emitters: [],
  from: null, to: null, sort: DocumentSort.DATE, direction: 'DESC' as const,
};

describe('DocumentActiveFiltersPresenter', () => {
  const presenter = new DocumentActiveFiltersPresenter();

  it('shows one removable chip per applied filter group, values in the domain order', () => {
    expect(
      presenter.present({
        ...everything,
        categories: [DocumentCategory.PROOF, DocumentCategory.SICK_LEAVE],
        statuses: [DocumentStatus.NEW],
        emitters: [DocumentEmitter.SELF],
        from: '2026-10-01',
      }),
    ).toEqual([
      { key: 'categories', label: 'Catégorie', value: 'Arrêt maladie, Justificatif' },
      { key: 'statuses', label: 'Statut', value: 'Nouveau' },
      { key: 'period', label: 'Période', value: 'à partir du 01/10/2026' },
      { key: 'emitter', label: 'Émetteur', value: 'Vous' },
    ]);
  });

  it('shows no chip when nothing narrows the list', () => {
    expect(presenter.present({ ...everything, search: 'arrêt' })).toEqual([]);
  });
});
