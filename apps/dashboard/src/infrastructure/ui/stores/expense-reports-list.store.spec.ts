import { useExpenseReportsListStore } from './expense-reports-list.store';

const initial = useExpenseReportsListStore.getState();

beforeEach(() => {
  useExpenseReportsListStore.setState(initial, true);
});

describe('expense reports list store', () => {
  it('starts with every report, the most recent first', () => {
    expect(useExpenseReportsListStore.getState()).toMatchObject({
      search: '', categories: [], statuses: [], projects: [], proofs: [], from: null, to: null,
      minAmount: null, maxAmount: null, sort: null, direction: 'DESC',
    });
  });

  it('ticks and unticks a project', () => {
    const store = useExpenseReportsListStore.getState();

    store.toggleProject('Salon');
    store.toggleProject('Valette');
    store.toggleProject('Salon');

    expect(useExpenseReportsListStore.getState().projects).toEqual(['Valette']);
  });

  it('keeps one receipt presence at most', () => {
    const store = useExpenseReportsListStore.getState();

    store.setProof('WITH');
    store.setProof('WITHOUT');
    expect(useExpenseReportsListStore.getState().proofs).toEqual(['WITHOUT']);
    store.setProof(null);
    expect(useExpenseReportsListStore.getState().proofs).toEqual([]);
  });

  it('drops an amount bound left blank', () => {
    const store = useExpenseReportsListStore.getState();

    store.setMinAmount('10');
    store.setMaxAmount('  ');

    expect(useExpenseReportsListStore.getState()).toMatchObject({ minAmount: '10', maxAmount: null });
  });

  it('cycles the ordering of a column', () => {
    const store = useExpenseReportsListStore.getState();

    store.cycleSort('AMOUNT');
    expect(useExpenseReportsListStore.getState()).toMatchObject({ sort: 'AMOUNT', direction: 'ASC' });
    store.cycleSort('AMOUNT');
    expect(useExpenseReportsListStore.getState()).toMatchObject({ sort: 'AMOUNT', direction: 'DESC' });
    store.cycleSort('AMOUNT');
    expect(useExpenseReportsListStore.getState()).toMatchObject({ sort: null, direction: 'DESC' });
  });

  it('removes one filter group, or every filter but the search', () => {
    const store = useExpenseReportsListStore.getState();
    store.setSearch('lyon');
    store.toggleCategory('MEAL');
    store.setMinAmount('10');
    store.setMaxAmount('50');

    store.removeFilter('amount');
    expect(useExpenseReportsListStore.getState()).toMatchObject({ minAmount: null, maxAmount: null, categories: ['MEAL'] });
    store.clearFilters();
    expect(useExpenseReportsListStore.getState()).toMatchObject({ search: 'lyon', categories: [] });
  });
});
