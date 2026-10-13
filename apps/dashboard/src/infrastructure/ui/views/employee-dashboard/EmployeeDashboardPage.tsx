import type { EmployeeDashboardComposition } from '../../../composition/employee-dashboard.composition';
import { EmployeeDashboard } from './EmployeeDashboard';

interface EmployeeDashboardPageProps {
  deps: EmployeeDashboardComposition;
}

export function EmployeeDashboardPage({ deps }: EmployeeDashboardPageProps) {
  return <EmployeeDashboard model={deps.employeeDashboardPresenter.present()} />;
}
