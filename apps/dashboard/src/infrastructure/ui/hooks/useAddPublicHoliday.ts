import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanySettingsComposition } from '../../composition/company-settings.composition';
import { getCompanySettingsQueryKey } from './useGetCompanySettings';

export function useAddPublicHoliday({
  controller,
}: CompanySettingsComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { date: string; label: string }) => {
      await controller.addPublicHoliday(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getCompanySettingsQueryKey(),
      });
    },
  });
}
