import { ExpenseReportSort } from '@hexagonal-monorepo-template/domain';
import { EmptyTableRow } from '../../../common/data/EmptyTableRow';
import { SortableHead } from '../../../common/data/SortableHead';
import { i18n } from '../../../i18n/i18n';
import { Table, TableHead, TableHeader } from '../../../shared/table';
import { ExpenseReportRow } from './ExpenseReportRow';
import type { ExpenseReportRowModel } from '../../../../../adapters/presenters/expense-reports/expense-report-row.presenter';
import type { ExpenseReportSortModel } from '../../../../../adapters/presenters/expense-reports/expense-report-sort.presenter';

const COLUMNS = 'minmax(0,2.2fr) 96px minmax(0,1.1fr) minmax(0,1fr) 104px 176px 108px 20px';

interface ExpenseReportsTableProps {
  rows: ExpenseReportRowModel[];
  sort: ExpenseReportSortModel;
  /** Shown instead of rows when there is none. */
  emptyMessage: string;
  /** The report just submitted or changed, tinted blue. */
  highlightedId: string | null;
  onCycleSort: (sort: ExpenseReportSort) => void;
  onOpen: (expenseReportId: string) => void;
}

export function ExpenseReportsTable({
  rows,
  sort,
  emptyMessage,
  highlightedId,
  onCycleSort,
  onOpen,
}: ExpenseReportsTableProps) {
  const labels = i18n.messages.expenseReports.list.columns;
  const sortable = (column: ExpenseReportSort) => ({
    model: sort[column],
    onSort: () => onCycleSort(column),
  });

  return (
    <Table columns={COLUMNS}>
      <TableHeader className="gap-4 px-5">
        <TableHead>{labels.report}</TableHead>
        <SortableHead {...sortable(ExpenseReportSort.DATE)}>{labels.date}</SortableHead>
        <SortableHead {...sortable(ExpenseReportSort.CATEGORY)}>{labels.category}</SortableHead>
        <SortableHead {...sortable(ExpenseReportSort.PROJECT)}>{labels.project}</SortableHead>
        <SortableHead {...sortable(ExpenseReportSort.AMOUNT)}>{labels.amount}</SortableHead>
        <SortableHead {...sortable(ExpenseReportSort.STATUS)}>{i18n.messages.common.status}</SortableHead>
        <SortableHead {...sortable(ExpenseReportSort.PROOF)}>{labels.proof}</SortableHead>
        <span />
      </TableHeader>
      {rows.map((row) => (
        <ExpenseReportRow
          key={row.id}
          model={row}
          highlighted={row.id === highlightedId}
          onOpen={() => onOpen(row.id)}
        />
      ))}
      {rows.length === 0 && <EmptyTableRow message={emptyMessage} />}
    </Table>
  );
}
