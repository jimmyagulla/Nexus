import { render, screen } from '@testing-library/react';
import type { ExpenseReportViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseReportList } from './ExpenseReportList';

function report(id: string, label: string): ExpenseReportViewModel {
  return {
    id,
    label,
    status: 'DRAFT',
    statusLabel: 'Brouillon',
    editable: true,
    requestable: false,
    decidable: false,
    total: '0 €',
    receipts: [],
    expenses: [],
  };
}

describe('ExpenseReportList', () => {
  it('lists every report', () => {
    render(
      <ExpenseReportList
        reports={[report('r1', 'Lyon'), report('r2', 'Paris')]}
        emptyMessage={i18n.messages.expenseReports.empty}
        onOpen={() => undefined}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('tells the employee she has not submitted any report yet', () => {
    render(
      <ExpenseReportList
        reports={[]}
        emptyMessage={i18n.messages.expenseReports.empty}
        onOpen={() => undefined}
      />,
    );

    expect(screen.getByText(i18n.messages.expenseReports.empty).textContent).toBe(
      "Vous n'avez encore soumis aucune note de frais.",
    );
  });

  it('says nothing when no message is asked for', () => {
    const { container } = render(
      <ExpenseReportList reports={[]} emptyMessage={null} onOpen={() => undefined} />,
    );

    expect(container.textContent).toBe('');
  });
});
