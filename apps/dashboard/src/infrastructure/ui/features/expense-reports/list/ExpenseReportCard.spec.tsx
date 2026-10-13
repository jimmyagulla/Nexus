import { fireEvent, render, screen } from '@testing-library/react';
import type { ExpenseReportViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseReportCard } from './ExpenseReportCard';

const report: ExpenseReportViewModel = {
  id: 'r1',
  label: 'Déplacement Lyon',
  status: 'DRAFT',
  statusLabel: 'Brouillon',
  editable: true,
  total: '0 €',
  receipts: [],
  expenses: [],
};

describe('ExpenseReportCard', () => {
  it('shows the label and the status of the report', () => {
    render(
      <ul>
        <ExpenseReportCard report={report} onOpen={() => undefined} />
      </ul>,
    );

    expect(screen.getByText('Déplacement Lyon')).toBeTruthy();
    expect(screen.getByText('Brouillon')).toBeTruthy();
  });

  it('shows the total of the report', () => {
    render(
      <ul>
        <ExpenseReportCard
          report={{ ...report, total: '125 €' }}
          onOpen={() => undefined}
        />
      </ul>,
    );

    expect(screen.getByText('125 €')).toBeTruthy();
  });

  it('opens the report on demand', () => {
    const opened: string[] = [];
    render(
      <ul>
        <ExpenseReportCard report={report} onOpen={(id) => opened.push(id)} />
      </ul>,
    );

    fireEvent.click(
      screen.getByRole('button', { name: i18n.messages.expenseReports.open }),
    );

    expect(opened).toEqual(['r1']);
  });
});
