import { Greeting } from '@hexagonal-monorepo-template/domain';

export interface IHelloInboundPort {
  execute(): Greeting;
}

/**
 * DI Token for IHelloInboundPort (interfaces are erased at runtime).
 */
export const IHelloInboundPort = Symbol('IHelloInboundPort');
