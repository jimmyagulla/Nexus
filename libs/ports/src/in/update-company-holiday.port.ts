import { Company } from '@hexagonal-monorepo-template/domain';

export interface UpdateCompanyHolidayCommand {
  companyId: string;
  actorCompanyId: string;
  holidayId: string;
  date: string;
  label: string;
}

export interface IUpdateCompanyHolidayInboundPort {
  execute(command: UpdateCompanyHolidayCommand): Promise<Company>;
}

export const IUpdateCompanyHolidayInboundPort = Symbol(
  'IUpdateCompanyHolidayInboundPort',
);
