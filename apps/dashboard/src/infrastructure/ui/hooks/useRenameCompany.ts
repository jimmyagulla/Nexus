import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanySettingsComposition } from '../../composition/company-settings.composition';
import { getCompanySettingsQueryKey } from './useGetCompanySettings';

export function useRenameCompany({ controller }: CompanySettingsComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      await controller.renameCompany(name);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getCompanySettingsQueryKey(),
      });
    },
  });
}
