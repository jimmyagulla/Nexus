import { i18n } from '../../../i18n/i18n';
import { Table, TableHead, TableHeader } from '../../../shared/table';
import { OvertimeDeclarationRow } from './OvertimeDeclarationRow';
import type { OvertimeDeclarationRowModel } from '../../../../../adapters/presenters/overtime/overtime.view-models';

interface OvertimeDeclarationTableProps {
  declarations: OvertimeDeclarationRowModel[];
}

const columns = '110px 90px minmax(0,1fr) 110px 200px 24px';

/** The employee's overtime declarations, most recent first. */
export function OvertimeDeclarationTable({ declarations }: OvertimeDeclarationTableProps) {
  const labels = i18n.messages.overtime.list;

  return (
    <Table columns={columns}>
      <TableHeader className="gap-4 px-5">
        <TableHead>{labels.date}</TableHead>
        <TableHead className="justify-end">{labels.hours}</TableHead>
        <TableHead>{labels.reason}</TableHead>
        <TableHead>{labels.proof}</TableHead>
        <TableHead>{i18n.messages.common.status}</TableHead>
        <TableHead />
      </TableHeader>
      {declarations.map((declaration) => (
        <OvertimeDeclarationRow
          key={`${declaration.date}-${declaration.reason}`}
          {...declaration}
        />
      ))}
    </Table>
  );
}
