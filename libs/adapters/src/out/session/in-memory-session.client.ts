import {
  ISessionClient,
  SessionRecord,
} from '@hexagonal-monorepo-template/ports';

export class InMemorySessionClient implements ISessionClient {
  refreshes = 0;

  constructor(private readonly session: SessionRecord | null) {}

  async getSession(): Promise<SessionRecord | null> {
    return this.session;
  }

  async refreshSession(): Promise<void> {
    this.refreshes += 1;
  }
}
