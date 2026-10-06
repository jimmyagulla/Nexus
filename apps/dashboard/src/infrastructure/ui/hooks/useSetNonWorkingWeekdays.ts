import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DayOfWeek } from '@hexagonal-monorepo-template/domain';
import { CompanySettingsComposition } from '../../composition/company-settings.composition';
import { getCompanySettingsQueryKey } from './useGetCompanySettings';

export function useSetNonWorkingWeekdays({
  controller,
}: CompanySettingsComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weekdays: readonly DayOfWeek[]) => {
      await controller.updateNonWorkingWeekdays(weekdays);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getCompanySettingsQueryKey(),
      });
    },
  });
}
