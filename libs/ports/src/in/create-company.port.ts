import { Company } from '@hexagonal-monorepo-template/domain';

export interface ICreateCompanyInboundPort {
  execute(name: string): Promise<Company>;
}

export const ICreateCompanyInboundPort = Symbol('ICreateCompanyInboundPort');
