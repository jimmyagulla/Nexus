import {
  ClientSessionGateway,
  InMemorySessionClient,
  localDevSession,
} from '@hexagonal-monorepo-template/adapters';
import { ISessionGateway } from '@hexagonal-monorepo-template/ports';
import { SupabaseSessionClient } from '@hexagonal-monorepo-template/infrastructure/supabase/browser';
import { loadDashboardConfig } from '../config/load-dashboard-config';

export function createSessionGateway(): ISessionGateway {
  const config = loadDashboardConfig();
  if (config.authDisabled) {
    return new ClientSessionGateway(new InMemorySessionClient(localDevSession));
  }

  if (config.supabaseUrl === '' || config.supabaseAnonKey === '') {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in the monorepo root .env',
    );
  }

  return new ClientSessionGateway(
    new SupabaseSessionClient({
      url: config.supabaseUrl,
      anonKey: config.supabaseAnonKey,
    }),
  );
}
