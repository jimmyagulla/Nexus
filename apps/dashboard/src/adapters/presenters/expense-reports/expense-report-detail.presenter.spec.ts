import { ExpenseReportSummary } from '@hexagonal-monorepo-template/domain';
import { FileSizePresenter } from '../documents/file-size.presenter';
import { ExpenseAmountPresenter } from './expense-amount.presenter';
import { ExpenseReportDetailPresenter } from './expense-report-detail.presenter';

const summary: ExpenseReportSummary = {
      id: 'e1', date: '2026-09-28', category: 'TRAVEL', paymentMethod: 'PERSONAL_CARD', amount: '68.00',
      vatRate: 10, vatAmount: '6.18', description: 'Montpellier – Lyon', project: 'Client Valette',
      proof: { fileName: 'billet.pdf', format: 'PDF', sizeBytes: 219_136 }, status: 'SUBMITTED', editable: true,
      submittedAt: '2026-09-28T16:00:00.000Z', processedAt: null,
    };

describe('ExpenseReportDetailPresenter', () => {
  const presenter = new ExpenseReportDetailPresenter(new ExpenseAmountPresenter(), new FileSizePresenter());

  it('presents every field of the report and its receipt', () => {
    const detail = presenter.present(summary);

    expect(detail.fields.map((field) => field.value)).toEqual([
      '28/09/2026', 'Déplacement (train, avion…)', '68,00\u00a0€', '10 % · 6,18\u00a0€', 'Carte personnelle',
      'Client Valette', '28/09/2026', 'Pas encore traitée',
    ]);
    expect([detail.editable, detail.lockedNote, detail.proof]).toEqual([
      true, null, { name: 'billet.pdf', details: '214 Ko · PDF', icon: 'ri-file-pdf-2-line' },
    ]);
  });

  it('says the report is locked once processed, with its processing date', () => {
    const detail = presenter.present({
      ...summary, status: 'REFUNDED', editable: false, processedAt: '2026-10-08T09:00:00.000Z', vatRate: null, vatAmount: null, proof: null,
    });

    expect([detail.status, detail.fields[3]?.value, detail.fields[7]?.value, detail.proof]).toEqual([
      { label: 'Remboursée', tone: 'done' }, 'Aucune', '08/10/2026', null,
    ]);
    expect(detail.lockedNote).toContain('ne peut plus être modifiée');
  });
});
