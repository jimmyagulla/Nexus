import { Company } from '@hexagonal-monorepo-template/domain';

export interface AddCompanyHolidayCommand {
  companyId: string;
  actorCompanyId: string;
  date: string;
  label: string;
}

export interface IAddCompanyHolidayInboundPort {
  execute(command: AddCompanyHolidayCommand): Promise<Company>;
}

export const IAddCompanyHolidayInboundPort = Symbol(
  'IAddCompanyHolidayInboundPort',
);
