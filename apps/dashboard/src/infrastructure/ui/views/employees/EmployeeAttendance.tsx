import { FilterButton } from '../../common/data/FilterButton';
import { FilterChip } from '../../common/data/FilterChip';
import { PageContent } from '../../common/page/PageContent';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';
import { Table, TableHead, TableHeader } from '../../shared/table';
import {
  AttendanceMonthRow,
  type AttendanceMonthRowModel,
} from './components/AttendanceMonthRow';
import { EmployeeHeader, type EmployeeHeaderModel } from './components/EmployeeHeader';

export interface EmployeeAttendanceViewModel {
  employee: EmployeeHeaderModel;
  periodFilter: string;
  months: AttendanceMonthRowModel[];
}

const columns = '150px 130px 100px 90px 80px 80px minmax(0, 1fr)';

/** P8.4 — employee space seen by the employer, attendance tab. */
export function EmployeeAttendance({
  model,
}: {
  model: EmployeeAttendanceViewModel;
}) {
  const labels = i18n.messages.employees.attendance;

  return (
    <>
      <EmployeeHeader employee={model.employee} />
      <PageContent className="md:px-8 md:py-6">
        <div className="flex items-center gap-3">
          <FilterButton count={1} className="border border-primary bg-card" />
          <FilterChip label={labels.periodFilter} value={model.periodFilter} />
          <span className="text-13 text-muted-foreground">{labels.payrollNote}</span>
          <span className="flex-1" />
          <Button variant="outline">
            <i aria-hidden className="ri-file-excel-2-line" />
            {labels.export}
          </Button>
        </div>
        <Table columns={columns}>
          <TableHeader className="px-5">
            <TableHead>{labels.month}</TableHead>
            <TableHead>{labels.period}</TableHead>
            <TableHead className="justify-end">{labels.worked}</TableHead>
            <TableHead className="justify-end">{labels.absences}</TableHead>
            <TableHead className="justify-end">{labels.leaves}</TableHead>
            <TableHead className="justify-end">{labels.sickLeaves}</TableHead>
            <TableHead>{labels.otherEvents}</TableHead>
          </TableHeader>
          {model.months.map((row) => (
            <AttendanceMonthRow key={row.month} row={row} />
          ))}
        </Table>
      </PageContent>
    </>
  );
}
