import { Greeting } from '@hexagonal-monorepo-template/domain';

export interface IGreetingRepository {
  findDefault(): Greeting | null;
}

/**
 * DI Token for IGreetingRepository (interfaces are erased at runtime).
 */
export const IGreetingRepository = Symbol('IGreetingRepository');
