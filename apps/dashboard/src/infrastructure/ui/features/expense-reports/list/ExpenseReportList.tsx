import type { ExpenseReportViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { i18n } from '../../../i18n/i18n';
import { ExpenseReportCard } from './ExpenseReportCard';

interface ExpenseReportListProps {
  reports: ExpenseReportViewModel[];
  onOpen: (reportId: string) => void;
}

export function ExpenseReportList({ reports, onOpen }: ExpenseReportListProps) {
  if (reports.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {i18n.messages.expenseReports.empty}
      </p>
    );
  }

  return (
    <ul>
      {reports.map((report) => (
        <ExpenseReportCard key={report.id} report={report} onOpen={onOpen} />
      ))}
    </ul>
  );
}
