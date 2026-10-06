import { ActorContext } from '@hexagonal-monorepo-template/domain';
import { ISessionGateway } from '@hexagonal-monorepo-template/ports';

export class InMemorySessionGateway implements ISessionGateway {
  refreshes = 0;

  constructor(
    private readonly accessToken: string | null,
    private readonly actor: ActorContext | null,
  ) {}

  async getAccessToken(): Promise<string | null> {
    return this.accessToken;
  }

  async getActor(): Promise<ActorContext | null> {
    return this.actor;
  }

  async refresh(): Promise<void> {
    this.refreshes += 1;
  }
}
