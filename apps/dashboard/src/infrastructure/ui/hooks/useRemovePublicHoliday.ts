import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanySettingsComposition } from '../../composition/company-settings.composition';
import { getCompanySettingsQueryKey } from './useGetCompanySettings';

export function useRemovePublicHoliday({
  controller,
}: CompanySettingsComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (publicHolidayId: string) => {
      await controller.removePublicHoliday(publicHolidayId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getCompanySettingsQueryKey(),
      });
    },
  });
}
