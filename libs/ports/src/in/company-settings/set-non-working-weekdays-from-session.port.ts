import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';

export interface ISetNonWorkingWeekdaysFromSession {
  execute(weekdays: readonly DayOfWeek[]): Promise<CompanySettingsSnapshot>;
}

export const ISetNonWorkingWeekdaysFromSession = Symbol(
  'ISetNonWorkingWeekdaysFromSession',
);
