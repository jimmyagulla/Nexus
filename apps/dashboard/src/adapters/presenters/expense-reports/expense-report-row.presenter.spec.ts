import { ExpenseReportSummary } from '@hexagonal-monorepo-template/domain';
import { ExpenseAmountPresenter } from './expense-amount.presenter';
import { ExpenseReportRowPresenter } from './expense-report-row.presenter';

const summary: ExpenseReportSummary = {
      id: 'e1', date: '2026-09-28', category: 'TRAVEL', paymentMethod: 'PERSONAL_CARD', amount: '68.00',
      vatRate: 10, vatAmount: '6.18', description: 'Montpellier – Lyon', project: 'Client Valette',
      proof: { fileName: 'billet.pdf', format: 'PDF', sizeBytes: 219_136 }, status: 'SUBMITTED', editable: true,
      submittedAt: '2026-09-28T16:00:00.000Z', processedAt: null,
    };

describe('ExpenseReportRowPresenter', () => {
  const presenter = new ExpenseReportRowPresenter(new ExpenseAmountPresenter());

  it('presents a report as a row of the table', () => {
    expect(presenter.present(summary)).toEqual({
      id: 'e1', name: 'Montpellier – Lyon', icon: 'ri-train-line', category: 'Déplacement (train, avion…)',
      date: '28/09/2026', project: 'Client Valette', amount: '68,00\u00a0€',
      status: { label: 'Soumise', tone: 'submitted' }, proof: { attached: true, label: 'Justificatif joint' },
    });
  });

  it('shows a dash without project, and says when the receipt is missing', () => {
    const row = presenter.present({ ...summary, project: null, proof: null, status: 'REJECTED' });

    expect([row.project, row.proof, row.status]).toEqual([
      '—', { attached: false, label: 'Sans justificatif' }, { label: 'Refusée', tone: 'danger' },
    ]);
  });
});
