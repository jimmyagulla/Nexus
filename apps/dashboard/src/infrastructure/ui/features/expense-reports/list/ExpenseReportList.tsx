import type { ExpenseReportViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { ExpenseReportCard } from './ExpenseReportCard';

interface ExpenseReportListProps {
  reports: ExpenseReportViewModel[];
  emptyMessage: string | null;
  onOpen: (reportId: string) => void;
}

export function ExpenseReportList({
  reports,
  emptyMessage,
  onOpen,
}: ExpenseReportListProps) {
  if (reports.length === 0) {
    return emptyMessage === null ? null : (
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
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
