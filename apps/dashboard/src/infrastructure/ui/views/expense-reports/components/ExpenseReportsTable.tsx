import { i18n } from '../../../i18n/i18n';
import { Table, TableHead, TableHeader } from '../../../shared/table';
import { ExpenseReportRow } from './ExpenseReportRow';
import type { ExpenseReportRowModel } from '../../../../../adapters/presenters/expense-reports/expense-reports.view-models';

const COLUMNS = 'minmax(0,1fr) 140px 110px 110px 190px 24px';

export function ExpenseReportsTable({
  reports,
}: {
  reports: ExpenseReportRowModel[];
}) {
  const labels = i18n.messages.expenseReports.list.columns;

  return (
    <Table columns={COLUMNS}>
      <TableHeader className="gap-4 px-5">
        <TableHead>{labels.report}</TableHead>
        <TableHead>{labels.period}</TableHead>
        <TableHead>{labels.expenses}</TableHead>
        <TableHead className="justify-end">{labels.total}</TableHead>
        <TableHead>{labels.status}</TableHead>
        <span />
      </TableHeader>
      {reports.map((report) => (
        <ExpenseReportRow key={report.id} report={report} />
      ))}
    </Table>
  );
}
