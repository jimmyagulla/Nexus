import { ExpenseReportSummary } from '@hexagonal-monorepo-template/domain';
import { ExpenseAmountPresenter } from './expense-amount.presenter';
import { ExpenseReportConfirmationPresenter } from './expense-report-confirmation.presenter';

const report = { id: 'e1', amount: '125.00' } as ExpenseReportSummary;

describe('ExpenseReportConfirmationPresenter', () => {
  const presenter = new ExpenseReportConfirmationPresenter(new ExpenseAmountPresenter());

  it('confirms a submission with its amount', () => {
    expect(presenter.present(report, false)).toEqual({
      id: 'e1',
      title: 'Votre note de frais de 125,00 € a été soumise pour remboursement.',
      description: 'Statut : Soumise. Vous serez notifié à chaque étape de la validation.',
    });
  });

  it('confirms a change', () => {
    expect(presenter.present(report, true).title).toBe('Votre note de frais de 125,00 € a été mise à jour.');
  });
});
