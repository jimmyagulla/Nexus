import { Outlet } from '@tanstack/react-router';
import type { EmployerShellComposition } from '../../../composition/employer-shell.composition';
import { AppShell } from '../../common/layout/AppShell';
import { useGetEmployerShell } from '../../hooks/useGetEmployerShell';

interface EmployerShellPageProps {
  deps: EmployerShellComposition;
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
