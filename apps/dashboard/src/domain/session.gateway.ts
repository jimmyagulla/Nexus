import { ActorContext } from '@hexagonal-monorepo-template/domain';

export interface ISessionGateway {
  getAccessToken(): Promise<string | null>;
  getActor(): Promise<ActorContext | null>;
  refresh(): Promise<void>;
}
