import type { EmployerDashboardPageComposition } from '../../../composition/employer-dashboard/employer-dashboard-page.composition';
import { PageStatus } from '../../common/feedback/PageStatus';
import { useGetEmployerDashboard } from '../../hooks/useGetEmployerDashboard';
import { i18n } from '../../i18n/i18n';
import { EmployerDashboard } from './EmployerDashboard';

interface EmployerDashboardPageProps {
  deps: EmployerDashboardPageComposition;
}

export function EmployerDashboardPage({ deps }: EmployerDashboardPageProps) {
  const employerDashboard = useGetEmployerDashboard(deps);

  if (employerDashboard.isPending) {
    return <PageStatus>{i18n.messages.loading}</PageStatus>;
  }

  if (employerDashboard.isError) {
    return <PageStatus>{i18n.messages.common.loadingError}</PageStatus>;
  }

  return <EmployerDashboard model={employerDashboard.data} />;
}
