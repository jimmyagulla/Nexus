import { Outlet } from '@tanstack/react-router';
import type { EmployeeShellPageComposition } from '../../../composition/shell/employee-shell-page.composition';
import { AppShell } from '../../common/layout/AppShell';
import { useGetUnseenDocumentCount } from '../../hooks/documents/useGetUnseenDocumentCount';
import { useGetUnseenPayslipCount } from '../../hooks/payslips/useGetUnseenPayslipCount';
import { useGetEmployeeShell } from '../../hooks/shell/useGetEmployeeShell';

interface EmployeeShellPageProps {
  deps: EmployeeShellPageComposition;
}

/** Layout of the employee routes: the shell around the current screen. */
export function EmployeeShellPage({ deps }: EmployeeShellPageProps) {
  const unseenPayslips = useGetUnseenPayslipCount(deps.payslips);
  const unseenDocuments = useGetUnseenDocumentCount(deps.documents);
  const employeeShell = useGetEmployeeShell(deps, {
    unseenPayslips: unseenPayslips.data,
    unseenDocuments: unseenDocuments.data,
  });

  if (!employeeShell.isSuccess) {
    return null;
  }

  return (
    <AppShell model={employeeShell.data}>
      <Outlet />
    </AppShell>
  );
}
