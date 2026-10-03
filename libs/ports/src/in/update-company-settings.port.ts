import { Company, Weekday } from '@hexagonal-monorepo-template/domain';

export interface UpdateCompanyNameCommand {
  companyId: string;
  actorCompanyId: string;
  name: string;
}

export interface UpdateNonWorkingWeekdaysCommand {
  companyId: string;
  actorCompanyId: string;
  weekdays: Weekday[];
}

export interface HolidayMutationCommand {
  companyId: string;
  actorCompanyId: string;
  holidayId?: string;
  date: string;
  label: string;
}

export interface RemoveHolidayCommand {
  companyId: string;
  actorCompanyId: string;
  holidayId: string;
}

export interface IUpdateCompanySettingsInboundPort {
  updateName(command: UpdateCompanyNameCommand): Promise<Company>;
  updateNonWorkingWeekdays(
    command: UpdateNonWorkingWeekdaysCommand,
  ): Promise<Company>;
  addHoliday(command: HolidayMutationCommand): Promise<Company>;
  updateHoliday(command: HolidayMutationCommand): Promise<Company>;
  removeHoliday(command: RemoveHolidayCommand): Promise<Company>;
}

export const IUpdateCompanySettingsInboundPort = Symbol(
  'IUpdateCompanySettingsInboundPort',
);
