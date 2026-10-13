import { Outlet } from '@tanstack/react-router';
import type { EmployerShellPageComposition } from '../../../composition/shell/employer-shell-page.composition';
import { AppShell } from '../../common/layout/AppShell';
import { useGetEmployerShell } from '../../hooks/useGetEmployerShell';

interface EmployerShellPageProps {
  deps: EmployerShellPageComposition;
}

/** Layout of the employer routes: the shell around the current screen. */
export function EmployerShellPage({ deps }: EmployerShellPageProps) {
  const employerShell = useGetEmployerShell(deps);

  if (!employerShell.isSuccess) {
    return null;
  }

  return (
    <AppShell model={employerShell.data}>
      <Outlet />
    </AppShell>
  );
}
