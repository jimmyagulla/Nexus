import { i18n } from '../../../i18n/i18n';
import { TableCell, TableRow } from '../../../shared/table';
import type { AttendanceMonthRowModel } from '../../../../../adapters/presenters/employees/employees.view-models';

/** Monthly line of the employee attendance table. */
export function AttendanceMonthRow({ row }: { row: AttendanceMonthRowModel }) {
  return (
    <TableRow className="px-5 py-2.75 last:border-b">
      <TableCell className="font-semibold">{row.month}</TableCell>
      <TableCell className="text-muted-foreground">{row.period}</TableCell>
      <TableCell className="text-right font-semibold">
        <span>{row.worked}</span>
        {` ${i18n.messages.employees.attendance.daysUnit}`}
      </TableCell>
      <TableCell className="text-right">{row.absences}</TableCell>
      <TableCell className="text-right">{row.leaves}</TableCell>
      <TableCell className="text-right">{row.sickLeaves}</TableCell>
      <TableCell className="text-muted-foreground">{row.otherEvents}</TableCell>
    </TableRow>
  );
}
