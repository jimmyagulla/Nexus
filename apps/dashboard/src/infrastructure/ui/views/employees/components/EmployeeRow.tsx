import { Link } from '@tanstack/react-router';
import { i18n } from '../../../i18n/i18n';
import { AppRoutes } from '../../../routes/app-routes';
import { Avatar, AvatarFallback } from '../../../shared/avatar';
import { Badge } from '../../../shared/badge';
import { Button } from '../../../shared/button';
import { TableCell, TableRow } from '../../../shared/table';
import type { EmployeeRowModel } from '../../../../../adapters/presenters/employees/employees.view-models';

/** Line of the employees table. */
export function EmployeeRow({ employee }: { employee: EmployeeRowModel }) {
  return (
    <TableRow className="py-2 last:border-b">
      <TableCell className="flex items-center gap-2.5">
        <Avatar>
          <AvatarFallback>{employee.initials}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-foreground">{employee.name}</span>
      </TableCell>
      <TableCell className="text-body">{employee.position}</TableCell>
      <TableCell className="text-muted-foreground">{employee.service}</TableCell>
      <TableCell>
        <Badge tone={employee.status.tone}>{employee.status.label}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {employee.startDate}
      </TableCell>
      <TableCell className="text-13 text-muted-foreground">
        {employee.lastActivity}
      </TableCell>
      <Button asChild variant="outline" size="xs" className="px-2.5">
        <Link to={AppRoutes.employee} params={{ employeeId: employee.id }}>
          {i18n.messages.employees.list.openSpace}
        </Link>
      </Button>
    </TableRow>
  );
}
