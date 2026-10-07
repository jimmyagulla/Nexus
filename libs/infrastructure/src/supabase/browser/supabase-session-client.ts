import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type SupabaseBrowserConfig = {
  url: string;
  anonKey: string;
};

export type SupabaseSessionRecord = {
  accessToken: string;
  userId: string;
  appMetadata: Readonly<Record<string, unknown>>;
};

export class SupabaseSessionClient {
  private readonly client: SupabaseClient;

  constructor(config: SupabaseBrowserConfig) {
    this.client = createClient(config.url, config.anonKey);
  }

  async getSession(): Promise<SupabaseSessionRecord | null> {
    const { data } = await this.client.auth.getSession();
    const session = data.session;
    if (session === null || session === undefined) {
      return null;
    }

    return {
      accessToken: session.access_token,
      userId: session.user.id,
      appMetadata: session.user.app_metadata,
    };
  }

  async refreshSession(): Promise<void> {
    const { error } = await this.client.auth.refreshSession();
    if (error !== null && error !== undefined) {
      throw error;
    }
  }
}
