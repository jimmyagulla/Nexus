import {
  CompanySettingsSnapshot,
  DayOfWeek,
} from '@hexagonal-monorepo-template/domain';

/** Company settings as the API answers them, for the settings and the public holidays alike. */
export type CompanySettingsPayload = {
  id: string;
  name: string;
  nonWorkingWeekdays: DayOfWeek[];
  publicHolidays: { id: string; date: string; label: string }[];
};

export function toCompanySettingsSnapshot(
  payload: CompanySettingsPayload,
): CompanySettingsSnapshot {
  return {
    id: payload.id,
    name: payload.name,
    nonWorkingWeekdays: [...payload.nonWorkingWeekdays],
    publicHolidays: payload.publicHolidays.map((holiday) => ({
      id: holiday.id,
      date: holiday.date,
      label: holiday.label,
    })),
  };
}
