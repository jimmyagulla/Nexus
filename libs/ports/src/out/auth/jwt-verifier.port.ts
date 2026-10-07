import { ActorContext } from '@hexagonal-monorepo-template/domain';

export interface IJwtVerifier {
  verify(token: string): Promise<ActorContext>;
}

export const IJwtVerifier = Symbol('IJwtVerifier');
