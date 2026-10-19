import { ExpenseReportList, ExpenseReportListCriteria, ExpenseReportSort } from '@hexagonal-monorepo-template/domain';
import { CountLabelPresenter } from '../documents/count-label.presenter';
import { ExpenseReportListSummaryPresenter } from './expense-report-list-summary.presenter';

const everything: ExpenseReportListCriteria = {
  search: '', searchCategories: [], categories: [], statuses: [], projects: [], proofs: [],
  from: null, to: null, minAmount: null, maxAmount: null, sort: ExpenseReportSort.DATE, direction: 'DESC',
};

function list(items: number, total: number): ExpenseReportList {
  return {
    items: Array.from({ length: items }, () => ({} as ExpenseReportList['items'][number])),
    total,
    categoryCounts: { OTHER: 0, FUEL: 0, TRAVEL: 0, HOTEL: 0, PARKING: 0, MEAL: 0 },
    statusCounts: { IN_PROGRESS: 0, REJECTED: 0, REFUNDED: 0, SUBMITTED: 0 },
    proofCounts: { WITH: 0, WITHOUT: 0 },
    projectCounts: [],
    stats: { pending: { count: 0, amount: '0.00' }, refunded: { year: 2026, amount: '0.00' }, averageProcessingDays: null },
  };
}

describe('ExpenseReportListSummaryPresenter', () => {
  const presenter = new ExpenseReportListSummaryPresenter(new CountLabelPresenter());

  it('counts every report while nothing narrows the list', () => {
    expect(presenter.present(list(7, 7), everything)).toEqual({
      appliedFilterCount: 0, resultSummary: '7 notes de frais', canClearFilters: false,
      emptyMessage: 'Aucune note de frais ne correspond à votre recherche.',
    });
  });

  it('counts the results out of the total once filtered', () => {
    expect(presenter.present(list(2, 7), { ...everything, categories: ['MEAL'] })).toMatchObject({
      appliedFilterCount: 1, resultSummary: '2 résultats sur 7 ·', canClearFilters: true,
    });
  });

  it('says that nothing was submitted yet', () => {
    expect(presenter.present(list(0, 0), everything).emptyMessage).toBe("Vous n'avez encore soumis aucune note de frais.");
  });
});
