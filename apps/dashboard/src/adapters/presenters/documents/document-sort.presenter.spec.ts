import { DocumentSort } from '@hexagonal-monorepo-template/domain';
import { DocumentSortPresenter } from './document-sort.presenter';

describe('DocumentSortPresenter', () => {
  const presenter = new DocumentSortPresenter();

  it('shows every column unsorted by default', () => {
    const model = presenter.present({ sort: null, direction: 'DESC' });

    expect(Object.values(model).map((column) => column.state)).toEqual(['neutral', 'neutral', 'neutral', 'neutral', 'neutral']);
    expect(model.SIZE.label).toBe('Trier par Taille (non trié)');
  });

  it('marks the sorted column with its direction', () => {
    const model = presenter.present({ sort: DocumentSort.SIZE, direction: 'ASC' });

    expect(model.SIZE).toEqual({ state: 'asc', label: 'Trier par Taille (ordre croissant)' });
    expect(model.DATE.state).toBe('neutral');
    expect(presenter.present({ sort: DocumentSort.SIZE, direction: 'DESC' }).SIZE.state).toBe('desc');
  });
});
