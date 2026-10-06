import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ActorContext,
  isUserRole,
} from '@hexagonal-monorepo-template/domain';
import { ISessionGateway } from '../../domain/session.gateway';

export class SupabaseSessionGateway implements ISessionGateway {
  constructor(private readonly client: SupabaseClient) {}

  static fromEnv(): SupabaseSessionGateway {
    const url = import.meta.env.VITE_SUPABASE_URL ?? '';
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
    return new SupabaseSessionGateway(createClient(url, anonKey));
  }

  async getAccessToken(): Promise<string | null> {
    const { data } = await this.client.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async getActor(): Promise<ActorContext | null> {
    const { data } = await this.client.auth.getSession();
    const user = data.session?.user;
    if (user === undefined) {
      return null;
    }
    const metadata = user.app_metadata;
    const companyId =
      typeof metadata.company_id === 'string' ? metadata.company_id : null;
    const role =
      typeof metadata.role === 'string' && isUserRole(metadata.role)
        ? metadata.role
        : null;
    return { userId: user.id, companyId, role };
  }

  async refresh(): Promise<void> {
    await this.client.auth.refreshSession();
  }
}
