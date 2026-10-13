import { useQuery } from '@tanstack/react-query';
import { CompanyAccountsComposition } from '../../composition/company-accounts.composition';

export const getCompanyAccountsQueryKey = () => ['company-accounts'];

export function useGetCompanyAccounts({
  controller,
  presenter,
}: CompanyAccountsComposition) {
  return useQuery({
    queryKey: getCompanyAccountsQueryKey(),
    queryFn: async () => presenter.present(await controller.listAccounts()),
  });
}
