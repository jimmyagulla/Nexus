import { fireEvent, render, screen } from '@testing-library/react';
import type { ExpenseReportListViewModel } from '../../../adapters/presenters/expense-report.presenter';
import { ErrorPresenter } from '../../../adapters/presenters/error.presenter';
import { i18n } from '../i18n/i18n';
import { ExpenseReports } from './ExpenseReports';

function renderView(model: ExpenseReportListViewModel, opened: string[] = []) {
  render(
    <ExpenseReports
      model={model}
      errorPresenter={new ErrorPresenter()}
      createError={null}
      onCreate={async () => true}
      onOpen={(id) => opened.push(id)}
    />,
  );
}

const draft = {
  id: 'r1',
  label: 'Déplacement Lyon',
  status: 'DRAFT' as const,
  statusLabel: 'Brouillon',
  editable: true,
  total: '0 €',
  expenses: [],
};

describe('ExpenseReports', () => {
  it('titles the screen', () => {
    renderView({ canCreate: true, reports: [] });

    expect(
      screen.getByRole('heading', { name: i18n.messages.expenseReports.title }),
    ).toBeTruthy();
  });

  it('offers to create a report to an active employee', () => {
    renderView({ canCreate: true, reports: [] });

    expect(
      screen.getByRole('button', { name: i18n.messages.expenseReports.create }),
    ).toBeTruthy();
  });

  it('does not offer to create a report to an inactive employee', () => {
    renderView({ canCreate: false, reports: [] });

    expect(
      screen.queryByRole('button', {
        name: i18n.messages.expenseReports.create,
      }),
    ).toBeNull();
    expect(screen.getByText(i18n.messages.expenseReports.empty)).toBeTruthy();
  });

  it('lists the reports of the employee', () => {
    renderView({ canCreate: true, reports: [draft] });

    expect(screen.getByText('Déplacement Lyon')).toBeTruthy();
  });

  it('opens a report', () => {
    const opened: string[] = [];
    renderView({ canCreate: true, reports: [draft] }, opened);

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.expenseReports.open }),
    );

    expect(opened).toEqual(['r1']);
  });
});
