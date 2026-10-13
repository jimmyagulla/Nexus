import { Outlet } from '@tanstack/react-router';
import type { EmployeeShellComposition } from '../../../composition/employee-shell.composition';
import { AppShell } from '../../common/layout/AppShell';
import { useGetEmployeeShell } from '../../hooks/useGetEmployeeShell';

interface EmployeeShellPageProps {
  deps: EmployeeShellComposition;
}

/** Layout of the employee routes: the shell around the current screen. */
export function EmployeeShellPage({ deps }: EmployeeShellPageProps) {
  const employeeShell = useGetEmployeeShell(deps);

  if (!employeeShell.isSuccess) {
    return null;
  }

  return (
    <AppShell model={employeeShell.data}>
      <Outlet />
    </AppShell>
  );
}
