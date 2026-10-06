import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CompanySettingsSnapshot,
  UpdateNonWorkingWeekdaysFromClientCommand,
} from '@hexagonal-monorepo-template/ports';
import { companySettingsQueryKey } from './useGetCompanySettings';

export interface UseUpdateNonWorkingWeekdaysDeps {
  controller: {
    setWeekdays: (
      command: UpdateNonWorkingWeekdaysFromClientCommand,
    ) => Promise<CompanySettingsSnapshot>;
  };
}

export function useUpdateNonWorkingWeekdays({
  controller,
}: UseUpdateNonWorkingWeekdaysDeps) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: UpdateNonWorkingWeekdaysFromClientCommand) =>
      controller.setWeekdays(command),
    onSuccess: (_settings, command) => {
      void queryClient.invalidateQueries({
        queryKey: companySettingsQueryKey(command.companyId),
      });
    },
  });
}
