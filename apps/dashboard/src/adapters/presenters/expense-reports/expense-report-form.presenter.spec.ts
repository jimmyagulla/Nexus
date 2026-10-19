import { ExpenseReportSummary } from '@hexagonal-monorepo-template/domain';
import { FileSizePresenter } from '../documents/file-size.presenter';
import { ExpenseReportFormPresenter } from './expense-report-form.presenter';

const summary: ExpenseReportSummary = {
      id: 'e1', date: '2026-09-28', category: 'TRAVEL', paymentMethod: 'PERSONAL_CARD', amount: '68.00',
      vatRate: 10, vatAmount: '6.18', description: 'Montpellier – Lyon', project: 'Client Valette',
      proof: { fileName: 'billet.pdf', format: 'PDF', sizeBytes: 219_136 }, status: 'SUBMITTED', editable: true,
      submittedAt: '2026-09-28T16:00:00.000Z', processedAt: null,
    };

describe('ExpenseReportFormPresenter', () => {
  const presenter = new ExpenseReportFormPresenter(new FileSizePresenter());

  it('opens a new report empty, paid with a personal card', () => {
    const model = presenter.present(null, [{ project: 'Salon', count: 2 }]);

    expect([model.title, model.submitLabel, model.defaults, model.projectSuggestions, model.currentProof]).toEqual([
      'Nouvelle note de frais', 'Soumettre pour remboursement',
      { date: '', category: '', paymentMethod: 'PERSONAL_CARD', amount: '', vatRate: '', description: '', project: '', keepProof: false },
      ['Salon'], null,
    ]);
    expect(model.accept).toBe('.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png');
  });

  it('opens a report to change with its values and its receipt', () => {
    const model = presenter.present(summary, []);

    expect([model.title, model.defaults, model.currentProof]).toEqual([
      'Modifier la note de frais',
      {
        date: '2026-09-28', category: 'TRAVEL', paymentMethod: 'PERSONAL_CARD', amount: '68,00', vatRate: '10',
        description: 'Montpellier – Lyon', project: 'Client Valette', keepProof: true,
      },
      { name: 'billet.pdf', details: '214 Ko · Déjà joint', icon: 'ri-file-pdf-2-line' },
    ]);
  });
});
