export type CompanySettingsDto = {
  id: string;
  name: string;
  nonWorkingWeekdays: number[];
  holidays: { id: string; date: string; label: string }[];
};

export interface CompanySettingsGateway {
  create(name: string): Promise<CompanySettingsDto>;
  find(companyId: string): Promise<CompanySettingsDto>;
  updateName(companyId: string, name: string): Promise<CompanySettingsDto>;
  updateNonWorkingWeekdays(
    companyId: string,
    weekdays: number[],
  ): Promise<CompanySettingsDto>;
  addHoliday(
    companyId: string,
    date: string,
    label: string,
  ): Promise<CompanySettingsDto>;
  removeHoliday(
    companyId: string,
    holidayId: string,
  ): Promise<CompanySettingsDto>;
}
