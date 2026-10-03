import { Company, Weekday } from '@hexagonal-monorepo-template/domain';

export interface UpdateNonWorkingWeekdaysCommand {
  companyId: string;
  actorCompanyId: string;
  weekdays: Weekday[];
}

export interface IUpdateNonWorkingWeekdaysInboundPort {
  execute(command: UpdateNonWorkingWeekdaysCommand): Promise<Company>;
}

export const IUpdateNonWorkingWeekdaysInboundPort = Symbol(
  'IUpdateNonWorkingWeekdaysInboundPort',
);
