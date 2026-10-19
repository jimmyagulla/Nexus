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
      search: '', categories: [], statuses: [], emitters: [], from: null, to: null, sort: null, direction: 'DESC',
    });
  });

  it('ticks and unticks a category', () => {
    const store = useDocumentsListStore.getState();

    store.toggleCategory(DocumentCategory.PROOF);
    store.toggleCategory(DocumentCategory.OTHER);
    store.toggleCategory(DocumentCategory.PROOF);

    expect(useDocumentsListStore.getState().categories).toEqual([DocumentCategory.OTHER]);
  });

  it('cycles a column through ascending, descending, then unsorted', () => {
    const store = useDocumentsListStore.getState();
    const seen: unknown[] = [];

    for (let click = 0; click < 3; click += 1) {
      store.cycleSort(DocumentSort.NAME);
      const { sort, direction } = useDocumentsListStore.getState();
      seen.push([sort, direction]);
    }

    expect(seen).toEqual([[DocumentSort.NAME, 'ASC'], [DocumentSort.NAME, 'DESC'], [null, 'DESC']]);
  });

  it('starts another column ascending', () => {
    const store = useDocumentsListStore.getState();
    store.cycleSort(DocumentSort.NAME);
    store.cycleSort(DocumentSort.NAME);

    store.cycleSort(DocumentSort.SIZE);

    expect(useDocumentsListStore.getState()).toMatchObject({ sort: DocumentSort.SIZE, direction: 'ASC' });
  });

  it('removes one filter group and keeps the others', () => {
    const store = useDocumentsListStore.getState();
    store.toggleStatus(DocumentStatus.NEW);
    store.setFrom('2026-10-01');
    store.setTo('2026-10-31');

    store.removeFilter('period');

    expect(useDocumentsListStore.getState()).toMatchObject({ statuses: [DocumentStatus.NEW], from: null, to: null });
  });

  it('clears every filter but keeps the search and the ordering', () => {
    const store = useDocumentsListStore.getState();
    store.setSearch('arrêt');
    store.cycleSort(DocumentSort.SIZE);
    store.toggleCategory(DocumentCategory.PROOF);
    store.setEmitter(DocumentEmitter.HR);

    store.clearFilters();

    expect(useDocumentsListStore.getState()).toMatchObject({
      search: 'arrêt', sort: DocumentSort.SIZE, direction: 'ASC', categories: [], emitters: [],
    });
  });

  it('keeps a single emitter, or every emitter', () => {
    const store = useDocumentsListStore.getState();

    store.setEmitter(DocumentEmitter.SELF);
    expect(useDocumentsListStore.getState().emitters).toEqual([DocumentEmitter.SELF]);

    store.setEmitter(null);
    expect(useDocumentsListStore.getState().emitters).toEqual([]);
  });

  it('drops a period bound cleared in the date picker', () => {
    const store = useDocumentsListStore.getState();
    store.setFrom('2026-10-01');

    store.setFrom('');

    expect(useDocumentsListStore.getState().from).toBeNull();
  });
});
