import { ExpenseReportSortPresenter } from './expense-report-sort.presenter';

describe('ExpenseReportSortPresenter', () => {
  const presenter = new ExpenseReportSortPresenter();

  it('marks the sorted column and labels every column', () => {
    const model = presenter.present({ sort: 'AMOUNT', direction: 'ASC' });

    expect([model.AMOUNT, model.DATE]).toEqual([
      { state: 'asc', label: 'Trier par Montant (ordre croissant)' },
      { state: 'neutral', label: 'Trier par Date (non trié)' },
    ]);
  });
});
