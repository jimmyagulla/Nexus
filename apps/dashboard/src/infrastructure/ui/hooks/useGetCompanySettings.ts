import { useQuery } from '@tanstack/react-query';
import { CompanySettingsComposition } from '../../composition/company-settings.composition';

export const getCompanySettingsQueryKey = () => ['company-settings'];

export function useGetCompanySettings({
  controller,
  presenter,
}: CompanySettingsComposition) {
  return useQuery({
    queryKey: getCompanySettingsQueryKey(),
    queryFn: async () => presenter.present(await controller.getSettings()),
  });
}
