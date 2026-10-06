import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CompanySettingsSnapshot,
  UpdateCompanyNameFromClientCommand,
} from '@hexagonal-monorepo-template/ports';
import { companySettingsQueryKey } from './useGetCompanySettings';

export interface UseRenameCompanyDeps {
  controller: {
    rename: (
      command: UpdateCompanyNameFromClientCommand,
    ) => Promise<CompanySettingsSnapshot>;
  };
}

export function useRenameCompany({ controller }: UseRenameCompanyDeps) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: UpdateCompanyNameFromClientCommand) =>
      controller.rename(command),
    onSuccess: (_settings, command) => {
      void queryClient.invalidateQueries({
        queryKey: companySettingsQueryKey(command.companyId),
      });
    },
  });
}
