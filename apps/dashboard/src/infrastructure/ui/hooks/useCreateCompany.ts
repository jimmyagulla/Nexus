import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanySettingsController } from '../../../adapters/controllers/company-settings/company-settings.controller';
import { setCompanyId } from '../stores/company-session.store';
import { companySettingsQueryKey } from './useGetCompanySettings';

export function useCreateCompany(controller: CompanySettingsController) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => controller.create(name),
    onSuccess: (created) => {
      setCompanyId(created.id);
      void queryClient.invalidateQueries({
        queryKey: companySettingsQueryKey(created.id),
      });
    },
  });
}
