import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { PersonalContactValues } from '@hexagonal-monorepo-template/domain';
import type { PersonalInfoPageComposition } from '../../../composition/personal-info/personal-info-page.composition';
import { getPersonalInfoQueryKey } from './useGetPersonalInfo';

export function useUpdatePersonalContact({ controller }: PersonalInfoPageComposition) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: PersonalContactValues) => controller.updateContact(contact),
    onSuccess: (info) => {
      queryClient.setQueryData(getPersonalInfoQueryKey(), info);
      void queryClient.invalidateQueries({ queryKey: getPersonalInfoQueryKey() });
    },
  });
}
