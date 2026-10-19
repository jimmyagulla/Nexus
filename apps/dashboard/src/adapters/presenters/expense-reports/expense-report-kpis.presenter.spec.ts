import { CountLabelPresenter } from '../documents/count-label.presenter';
import { ExpenseAmountPresenter } from './expense-amount.presenter';
import { ExpenseReportKpisPresenter } from './expense-report-kpis.presenter';

describe('ExpenseReportKpisPresenter', () => {
  const presenter = new ExpenseReportKpisPresenter(new ExpenseAmountPresenter(), new CountLabelPresenter());

  it('presents what waits for a refund, what was refunded this year and the mean processing time', () => {
    expect(presenter.present({
      pending: { count: 2, amount: '154.50' },
      refunded: { year: 2026, amount: '1284.60' },
      averageProcessingDays: 12,
    })).toEqual([
      { label: 'En cours · 2 notes', value: '154,50\u00a0€', icon: 'ri-receipt-line' },
      { label: 'Remboursé en 2026', value: '1\u202f284,60\u00a0€' },
      { label: 'Délai moyen de traitement', value: '12 jours' },
    ]);
  });

  it('has no mean before any report is processed', () => {
    const [pending, , average] = presenter.present({
      pending: { count: 0, amount: '0.00' },
      refunded: { year: 2026, amount: '0.00' },
      averageProcessingDays: null,
    });

    expect([pending.label, average.value]).toEqual(['En cours · aucune note', '—']);
  });
});
