import { Company } from '@hexagonal-monorepo-template/domain';

export interface UpdateCompanyNameCommand {
  companyId: string;
  actorCompanyId: string;
  name: string;
}

export interface IUpdateCompanyNameInboundPort {
  execute(command: UpdateCompanyNameCommand): Promise<Company>;
}

export const IUpdateCompanyNameInboundPort = Symbol(
  'IUpdateCompanyNameInboundPort',
);
