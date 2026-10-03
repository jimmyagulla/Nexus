import { Company } from '@hexagonal-monorepo-template/domain';

export interface GetCompanySettingsQuery {
  companyId: string;
  actorCompanyId: string;
}

export interface IGetCompanySettingsInboundPort {
  execute(query: GetCompanySettingsQuery): Promise<Company>;
}

export const IGetCompanySettingsInboundPort = Symbol(
  'IGetCompanySettingsInboundPort',
);
