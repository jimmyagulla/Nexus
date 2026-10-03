import { Company } from '@hexagonal-monorepo-template/domain';

export interface RemoveCompanyHolidayCommand {
  companyId: string;
  actorCompanyId: string;
  holidayId: string;
}

export interface IRemoveCompanyHolidayInboundPort {
  execute(command: RemoveCompanyHolidayCommand): Promise<Company>;
}

export const IRemoveCompanyHolidayInboundPort = Symbol(
  'IRemoveCompanyHolidayInboundPort',
);
