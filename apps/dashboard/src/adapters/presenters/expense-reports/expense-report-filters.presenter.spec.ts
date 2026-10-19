import { ExpenseReportList, ExpenseReportSort } from '@hexagonal-monorepo-template/domain';
import { EVERY_EXPENSE_REPORT } from '../../controllers/expense-reports.controller';
import { CountLabelPresenter } from '../documents/count-label.presenter';
import { ExpenseReportFiltersPresenter } from './expense-report-filters.presenter';

const list: ExpenseReportList = {
  items: [],
  total: 5,
  categoryCounts: { OTHER: 0, FUEL: 1, TRAVEL: 2, HOTEL: 0, PARKING: 0, MEAL: 2 },
  statusCounts: { IN_PROGRESS: 1, REJECTED: 0, REFUNDED: 3, SUBMITTED: 1 },
  proofCounts: { WITH: 4, WITHOUT: 1 },
  projectCounts: [{ project: 'Salon', count: 3 }, { project: 'Valette', count: 1 }],
  stats: { pending: { count: 2, amount: '80.00' }, refunded: { year: 2026, amount: '120.00' }, averageProcessingDays: 9 },
};

describe('ExpenseReportFiltersPresenter', () => {
  const presenter = new ExpenseReportFiltersPresenter(new CountLabelPresenter());
  const state = { ...EVERY_EXPENSE_REPORT, projects: ['Salon'], proofs: ['WITHOUT' as const], minAmount: '10' };
  const criteria = {
    ...state, searchCategories: [], sort: ExpenseReportSort.DATE, minAmount: '10.00',
  };

  it('offers every category and status with its count, in the display order', () => {
    const model = presenter.present(list, state, criteria);

    expect(model.categories.map((option) => [option.label, option.count])).toEqual([
      ['Hôtel', 0], ['Carburant', 1], ['Déplacement (train, avion…)', 2], ['Parking', 0], ['Restauration', 2], ['Autre', 0],
    ]);
    expect(model.statuses.map((option) => option.id)).toEqual(['SUBMITTED', 'IN_PROGRESS', 'REFUNDED', 'REJECTED']);
  });

  it('offers the projects of the person and keeps the controls as set', () => {
    const model = presenter.present(list, state, criteria);

    expect(model.projects).toEqual([
      { id: 'Salon', label: 'Salon', count: 3, checked: true },
      { id: 'Valette', label: 'Valette', count: 1, checked: false },
    ]);
    expect([model.proof, model.minAmount, model.maxAmount, model.appliedLabel]).toEqual([
      'WITHOUT', '10', '', '3 filtres appliqués',
    ]);
  });
});
