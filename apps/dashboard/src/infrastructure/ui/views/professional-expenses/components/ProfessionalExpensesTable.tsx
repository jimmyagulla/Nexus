import { i18n } from '../../../i18n/i18n';
import { Table, TableHead, TableHeader } from '../../../shared/table';
import {
  ProfessionalExpenseRow,
  type ProfessionalExpenseRowModel,
} from './ProfessionalExpenseRow';

const COLUMNS = 'minmax(0,1fr) 140px minmax(0,1fr) 100px 190px 24px';

export function ProfessionalExpensesTable({
  requests,
}: {
  requests: ProfessionalExpenseRowModel[];
}) {
  const labels = i18n.messages.professionalExpenses.list.columns;

  return (
    <Table columns={COLUMNS}>
      <TableHeader className="gap-4 px-5">
        <TableHead>{labels.type}</TableHead>
        <TableHead>{labels.period}</TableHead>
        <TableHead>{labels.detail}</TableHead>
        <TableHead className="justify-end">{labels.amount}</TableHead>
        <TableHead>{labels.status}</TableHead>
        <span />
      </TableHeader>
      {requests.map((request) => (
        <ProfessionalExpenseRow key={request.id} request={request} />
      ))}
    </Table>
  );
}
