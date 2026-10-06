import { createClient } from '@supabase/supabase-js';

export type SupabaseServerConfig = {
  url: string;
  serviceRoleKey: string;
};

export function createSupabaseAdmin(config: SupabaseServerConfig) {
  return createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
