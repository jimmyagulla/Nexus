import {
  DocumentCategory,
  DocumentEmitter,
  DocumentSort,
  DocumentStatus,
} from '@hexagonal-monorepo-template/domain';
import { useDocumentsListStore } from './documents-list.store';

const initial = useDocumentsListStore.getState();

beforeEach(() => {
  useDocumentsListStore.setState(initial, true);
});

describe('documents list store', () => {
  it('starts with every document, the most recent first', () => {
    expect(useDocumentsListStore.getState()).toMatchObject({
      search: '', categories: [], statuses: [], emitter: null, from: '', to: '', sort: DocumentSort.DATE,
    });
  });

  it('ticks and unticks a category', () => {
    const store = useDocumentsListStore.getState();

    store.toggleCategory(DocumentCategory.PROOF);
    store.toggleCategory(DocumentCategory.OTHER);
    store.toggleCategory(DocumentCategory.PROOF);

    expect(useDocumentsListStore.getState().categories).toEqual([DocumentCategory.OTHER]);
  });

  it('removes one filter group and keeps the others', () => {
    const store = useDocumentsListStore.getState();
    store.toggleStatus(DocumentStatus.NEW);
    store.setFrom('01/10/2026');
    store.setTo('31/10/2026');

    store.removeFilter('period');

    expect(useDocumentsListStore.getState()).toMatchObject({ statuses: [DocumentStatus.NEW], from: '', to: '' });
  });

  it('clears every filter but keeps the search and the ordering', () => {
    const store = useDocumentsListStore.getState();
    store.setSearch('arrêt');
    store.setSort(DocumentSort.SIZE);
    store.toggleCategory(DocumentCategory.PROOF);
    store.setEmitter(DocumentEmitter.HR);

    store.clearFilters();

    expect(useDocumentsListStore.getState()).toMatchObject({
      search: 'arrêt', sort: DocumentSort.SIZE, categories: [], emitter: null,
    });
  });
});
