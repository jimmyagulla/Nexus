import type { EmployerDashboardComposition } from '../../../composition/employer-dashboard.composition';
import { EmployerDashboard } from './EmployerDashboard';

interface EmployerDashboardPageProps {
  deps: EmployerDashboardComposition;
}

export function EmployerDashboardPage({ deps }: EmployerDashboardPageProps) {
  return <EmployerDashboard model={deps.employerDashboardPresenter.present()} />;
}
