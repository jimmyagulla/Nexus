import type { ExpenseReportViewModel } from '../../../../../adapters/presenters/expense-report.presenter';
import { Button } from '../../../shared/button';
import { i18n } from '../../../i18n/i18n';

interface ExpenseReportCardProps {
  report: ExpenseReportViewModel;
  onOpen: (reportId: string) => void;
}

export function ExpenseReportCard({ report, onOpen }: ExpenseReportCardProps) {
  return (
    <li className="flex items-center gap-4 py-2">
      <span className="font-semibold">{report.label}</span>
      <span className="text-muted-foreground">{report.statusLabel}</span>
      <Button type="button" variant="outline" onClick={() => onOpen(report.id)}>
        {i18n.messages.expenseReports.open}
      </Button>
    </li>
  );
}
