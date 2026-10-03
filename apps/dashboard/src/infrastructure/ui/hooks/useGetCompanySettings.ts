import { useQuery } from '@tanstack/react-query';
import { CompanySettingsController } from '../../../adapters/controllers/company-settings/company-settings.controller';

export const companySettingsQueryKey = (companyId: string) =>
  ['company-settings', companyId] as const;

export function useGetCompanySettings(
  companyId: string | null,
  controller: CompanySettingsController,
) {
  return useQuery({
    queryKey: companySettingsQueryKey(companyId ?? ''),
    enabled: companyId !== null,
    queryFn: () => controller.load(companyId ?? ''),
  });
}
