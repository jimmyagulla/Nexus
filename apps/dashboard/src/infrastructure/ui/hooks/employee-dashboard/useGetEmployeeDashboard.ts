import { useQuery } from '@tanstack/react-query';
import type { EmployeeDashboardPageComposition } from '../../../composition/employee-dashboard/employee-dashboard-page.composition';
import { employeeDashboardFixture } from '../../fixtures/employee-dashboard.fixture';

export const getEmployeeDashboardQueryKey = () => ['employee-dashboard'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployeeDashboard({ presenter }: EmployeeDashboardPageComposition) {
  return useQuery({
    queryKey: getEmployeeDashboardQueryKey(),
    queryFn: async () => presenter.present(employeeDashboardFixture),
  });
}
