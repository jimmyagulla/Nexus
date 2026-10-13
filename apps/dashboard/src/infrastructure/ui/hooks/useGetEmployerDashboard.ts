import { useQuery } from '@tanstack/react-query';
import type { EmployerDashboardComposition } from '../../composition/employer-dashboard.composition';
import { employerDashboardFixture } from '../fixtures/employer-dashboard.fixture';

export const getEmployerDashboardQueryKey = () => ['employer-dashboard'];

/** Placeholder data until the use case exists: the fixture goes through the presenter. */
export function useGetEmployerDashboard({ presenter }: EmployerDashboardComposition) {
  return useQuery({
    queryKey: getEmployerDashboardQueryKey(),
    queryFn: async () => presenter.present(employerDashboardFixture),
  });
}
