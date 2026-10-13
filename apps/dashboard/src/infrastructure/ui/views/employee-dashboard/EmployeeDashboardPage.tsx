import type { EmployeeDashboardComposition } from '../../../composition/employee-dashboard.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetEmployeeDashboard } from '../../hooks/useGetEmployeeDashboard';
import { i18n } from '../../i18n/i18n';
import { EmployeeDashboard } from './EmployeeDashboard';

interface EmployeeDashboardPageProps {
  deps: EmployeeDashboardComposition;
}

export function EmployeeDashboardPage({ deps }: EmployeeDashboardPageProps) {
  const employeeDashboard = useGetEmployeeDashboard(deps);

  if (employeeDashboard.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (employeeDashboard.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <EmployeeDashboard model={employeeDashboard.data} />;
}
