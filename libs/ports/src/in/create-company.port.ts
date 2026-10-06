import { ActorContext, Company } from '@hexagonal-monorepo-template/domain';

export interface ICreateCompany {
  execute(input: { actor: ActorContext; name: string }): Promise<Company>;
}

export const ICreateCompany = Symbol('ICreateCompany');
