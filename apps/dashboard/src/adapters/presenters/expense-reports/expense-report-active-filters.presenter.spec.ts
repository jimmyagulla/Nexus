import { ExpenseReportListCriteria, ExpenseReportSort } from '@hexagonal-monorepo-template/domain';
import { ExpenseAmountPresenter } from './expense-amount.presenter';
import { ExpenseReportActiveFiltersPresenter } from './expense-report-active-filters.presenter';

const everything: ExpenseReportListCriteria = {
  search: '', searchCategories: [], categories: [], statuses: [], projects: [], proofs: [],
  from: null, to: null, minAmount: null, maxAmount: null, sort: ExpenseReportSort.DATE, direction: 'DESC',
};

describe('ExpenseReportActiveFiltersPresenter', () => {
  const presenter = new ExpenseReportActiveFiltersPresenter(new ExpenseAmountPresenter());

  it('shows no chip without filter', () => {
    expect(presenter.present({ ...everything, search: 'lyon' })).toEqual([]);
  });

  it('shows one chip per filter group, the values in the domain order', () => {
    expect(presenter.present({
      ...everything, categories: ['MEAL', 'HOTEL'], statuses: ['SUBMITTED'], projects: ['Salon', 'Valette'],
      proofs: ['WITHOUT'], from: '2026-09-01', to: '2026-09-30', minAmount: '10.00',
    })).toEqual([
      { key: 'categories', label: 'Catégorie', value: 'Hôtel, Restauration' },
      { key: 'statuses', label: 'Statut', value: 'Soumise' },
      { key: 'projects', label: 'Projet', value: 'Salon, Valette' },
      { key: 'proofs', label: 'Justificatif', value: 'Sans justificatif' },
      { key: 'period', label: 'Date de la dépense', value: 'du 01/09/2026 au 30/09/2026' },
      { key: 'amount', label: 'Montant TTC', value: 'à partir de 10,00\u00a0€' },
    ]);
  });

  it('says how the amounts are bounded', () => {
    expect(presenter.present({ ...everything, minAmount: '10.00', maxAmount: '150.00' })[0]?.value).toBe('de 10,00\u00a0€ à 150,00\u00a0€');
    expect(presenter.present({ ...everything, maxAmount: '150.00' })[0]?.value).toBe("jusqu'à 150,00\u00a0€");
  });
});
