import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AddCompanyHolidayFromClientCommand,
  CompanySettingsSnapshot,
} from '@hexagonal-monorepo-template/ports';
import { companySettingsQueryKey } from './useGetCompanySettings';

export interface UseAddCompanyHolidayDeps {
  controller: {
    addPublicHoliday: (
      command: AddCompanyHolidayFromClientCommand,
    ) => Promise<CompanySettingsSnapshot>;
  };
}

export function useAddCompanyHoliday({ controller }: UseAddCompanyHolidayDeps) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: AddCompanyHolidayFromClientCommand) =>
      controller.addPublicHoliday(command),
    onSuccess: (_settings, command) => {
      void queryClient.invalidateQueries({
        queryKey: companySettingsQueryKey(command.companyId),
      });
    },
  });
}
