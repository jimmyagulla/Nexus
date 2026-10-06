import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CompanySettingsSnapshot,
  CreateCompanyFromClientCommand,
} from '@hexagonal-monorepo-template/ports';
import { setCompanyId } from '../stores/company-session.store';
import { companySettingsQueryKey } from './useGetCompanySettings';

export interface UseCreateCompanyDeps {
  controller: {
    create: (
      command: CreateCompanyFromClientCommand,
    ) => Promise<CompanySettingsSnapshot>;
  };
}

export function useCreateCompany({ controller }: UseCreateCompanyDeps) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: CreateCompanyFromClientCommand) =>
      controller.create(command),
    onSuccess: (created) => {
      setCompanyId(created.id);
      void queryClient.invalidateQueries({
        queryKey: companySettingsQueryKey(created.id),
      });
    },
  });
}
