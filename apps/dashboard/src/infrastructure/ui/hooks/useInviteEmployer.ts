import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyAccountsComposition } from '../../composition/company-accounts.composition';
import { getCompanyAccountsQueryKey } from './useGetCompanyAccounts';

export function useInviteEmployer({ controller }: CompanyAccountsComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (identifier: string) => controller.inviteEmployer(identifier),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getCompanyAccountsQueryKey(),
      });
    },
  });
}
