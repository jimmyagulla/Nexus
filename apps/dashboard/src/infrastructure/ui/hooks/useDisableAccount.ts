import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyAccountsComposition } from '../../composition/company-accounts.composition';
import { getCompanyAccountsQueryKey } from './useGetCompanyAccounts';

export function useDisableAccount({ controller }: CompanyAccountsComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => controller.disableAccount(accountId),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: getCompanyAccountsQueryKey(),
      });
    },
  });
}
