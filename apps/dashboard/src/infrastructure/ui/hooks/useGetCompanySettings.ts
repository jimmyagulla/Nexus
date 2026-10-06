import { useQuery } from '@tanstack/react-query';
import {
  CompanySettingsSnapshot,
  LoadCompanySettingsFromClientQuery,
} from '@hexagonal-monorepo-template/ports';
import { CompanySettingsViewModel } from '../../../adapters/presenters/company-settings/company-settings.presenter';

export const companySettingsQueryKey = (companyId: string) =>
  ['company-settings', companyId] as const;

export interface UseGetCompanySettingsDeps {
  controller: {
    load: (
      query: LoadCompanySettingsFromClientQuery,
    ) => Promise<CompanySettingsSnapshot>;
  };
  presenter: {
    present: (settings: CompanySettingsSnapshot) => CompanySettingsViewModel;
  };
}

export function useGetCompanySettings(
  companyId: string | null,
  { controller, presenter }: UseGetCompanySettingsDeps,
) {
  return useQuery({
    queryKey: companySettingsQueryKey(companyId ?? ''),
    enabled: companyId !== null,
    queryFn: async () => {
      const settings = await controller.load({ companyId: companyId ?? '' });
      return presenter.present(settings);
    },
  });
}
