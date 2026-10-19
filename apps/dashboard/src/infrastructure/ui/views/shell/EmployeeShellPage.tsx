import { Outlet } from '@tanstack/react-router';
import type { EmployeeShellPageComposition } from '../../../composition/shell/employee-shell-page.composition';
import { AppShell } from '../../common/layout/AppShell';
import { useGetUnseenPayslipCount } from '../../hooks/payslips/useGetUnseenPayslipCount';
import { useGetEmployeeShell } from '../../hooks/shell/useGetEmployeeShell';

interface EmployeeShellPageProps {
  deps: EmployeeShellPageComposition;
}

/** Layout of the employee routes: the shell around the current screen. */
export function EmployeeShellPage({ deps }: EmployeeShellPageProps) {
  const unseenPayslips = useGetUnseenPayslipCount(deps.payslips);
  const employeeShell = useGetEmployeeShell(deps, { unseenPayslips: unseenPayslips.data });

  if (!employeeShell.isSuccess) {
    return null;
  }

  return (
    <AppShell model={employeeShell.data}>
      <Outlet />
    </AppShell>
  );
}
