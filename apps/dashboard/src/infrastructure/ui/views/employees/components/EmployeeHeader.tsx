import { Link } from '@tanstack/react-router';
import { i18n } from '../../../i18n/i18n';
import { AppRoutes } from '../../../routes/app-routes';
import { Avatar, AvatarFallback } from '../../../shared/avatar';
import { Badge, type BadgeProps } from '../../../shared/badge';
import { Button } from '../../../shared/button';
import { tabsTriggerClassName } from '../../../shared/tabs';

export interface EmployeeHeaderModel {
  id: string;
  initials: string;
  name: string;
  status: { label: string; tone: BadgeProps['tone'] };
  meta: string;
}

/** Banner of an employee space: identity, actions and the space tabs. */
export function EmployeeHeader({ employee }: { employee: EmployeeHeaderModel }) {
  const labels = i18n.messages.employees.space;
  const params = { employeeId: employee.id };
  /** Tabs not designed yet: they point to the overview without its active state. */
  const pendingTab = {
    to: AppRoutes.employee,
    params,
    activeProps: {},
    className: tabsTriggerClassName,
  } as const;

  return (
    <div className="flex flex-col gap-5 border-b border-border bg-card px-4 pt-6 md:px-8">
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <AvatarFallback className="text-18">{employee.initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1">
          <span className="flex items-center gap-2.5">
            <span className="text-22 font-bold text-heading">{employee.name}</span>
            <Badge tone={employee.status.tone}>{employee.status.label}</Badge>
          </span>
          <span className="text-14 text-muted-foreground">{employee.meta}</span>
        </div>
        <Button variant="outline">
          <i aria-hidden className="ri-mail-line" />
          {labels.contact}
        </Button>
        <Button>
          <i aria-hidden className="ri-upload-cloud-2-line" />
          {labels.uploadDocument}
        </Button>
      </div>
      <nav className="flex gap-7">
        <Link
          to={AppRoutes.employee}
          params={params}
          activeOptions={{ exact: true }}
          className={tabsTriggerClassName}
        >
          {labels.tabs.overview}
        </Link>
        <Link {...pendingTab}>{labels.tabs.documents}</Link>
        <Link {...pendingTab}>{labels.tabs.payslips}</Link>
        <Link
          to={AppRoutes.employeeAttendance}
          params={params}
          activeOptions={{ exact: true }}
          className={tabsTriggerClassName}
        >
          {labels.tabs.attendance}
        </Link>
        <Link {...pendingTab}>{labels.tabs.expenses}</Link>
        <Link {...pendingTab}>{labels.tabs.history}</Link>
      </nav>
    </div>
  );
}
