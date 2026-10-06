export type CompanySettingsSnapshot = {
  id: string;
  name: string;
  nonWorkingWeekdays: number[];
  holidays: { id: string; date: string; label: string }[];
};
