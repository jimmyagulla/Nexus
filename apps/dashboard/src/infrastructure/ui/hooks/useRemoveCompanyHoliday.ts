import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CompanySettingsSnapshot,
  RemoveCompanyHolidayFromClientCommand,
} from '@hexagonal-monorepo-template/ports';
import { companySettingsQueryKey } from './useGetCompanySettings';

export interface UseRemoveCompanyHolidayDeps {
  controller: {
    removePublicHoliday: (
      command: RemoveCompanyHolidayFromClientCommand,
    ) => Promise<CompanySettingsSnapshot>;
  };
}

export function useRemoveCompanyHoliday({
  controller,
}: UseRemoveCompanyHolidayDeps) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: RemoveCompanyHolidayFromClientCommand) =>
      controller.removePublicHoliday(command),
    onSuccess: (_settings, command) => {
      void queryClient.invalidateQueries({
        queryKey: companySettingsQueryKey(command.companyId),
      });
    },
  });
}
