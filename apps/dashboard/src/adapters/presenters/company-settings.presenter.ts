import {
  CompanySettingsSnapshot,
  DayOfWeek,
  ErrorCode,
  isErrorCode,
} from '@hexagonal-monorepo-template/domain';
import { fr } from '../../infrastructure/ui/i18n/fr';

export type CompanySettingsViewModel = {
  id: string;
  name: string;
  weekdays: { value: DayOfWeek; label: string; selected: boolean }[];
  publicHolidays: { id: string; date: string; label: string }[];
};

export function presentCompanySettings(
  snapshot: CompanySettingsSnapshot,
): CompanySettingsViewModel {
  const selected = new Set(snapshot.nonWorkingWeekdays);
  return {
    id: snapshot.id,
    name: snapshot.name,
    weekdays: Object.values(DayOfWeek).map((value) => ({
      value,
      label: fr.days[value],
      selected: selected.has(value),
    })),
    publicHolidays: [...snapshot.publicHolidays],
  };
}

export function presentError(error: unknown): string {
  if (error instanceof Error && isErrorCode(error.message)) {
    return fr.errors[error.message];
  }
  return fr.errors[ErrorCode.ACCESS_DENIED];
}
