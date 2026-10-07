import {
  ActorContext,
  toActorContext,
} from '@hexagonal-monorepo-template/domain';
import {
  ISessionClient,
  ISessionGateway,
} from '@hexagonal-monorepo-template/ports';

export class ClientSessionGateway implements ISessionGateway {
  constructor(private readonly client: ISessionClient) {}

  async getAccessToken(): Promise<string | null> {
    const session = await this.client.getSession();
    return session?.accessToken ?? null;
  }

  async getActor(): Promise<ActorContext | null> {
    const session = await this.client.getSession();
    if (session === null) {
      return null;
    }

    return toActorContext(session.userId, session.appMetadata);
  }

  async refresh(): Promise<void> {
    await this.client.refreshSession();
  }
}
