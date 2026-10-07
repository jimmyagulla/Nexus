import { readOptional } from '@hexagonal-monorepo-template/infrastructure';

export type DashboardConfig = {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  authDisabled: boolean;
};

const DEFAULT_API_URL = 'http://localhost:3000/api';

export function loadDashboardConfig(
  env: Record<string, string | undefined> = import.meta.env,
): DashboardConfig {
  return {
    apiUrl: readOptional(env['VITE_API_URL']) ?? DEFAULT_API_URL,
    supabaseUrl: readOptional(env['VITE_SUPABASE_URL']) ?? '',
    supabaseAnonKey: readOptional(env['VITE_SUPABASE_ANON_KEY']) ?? '',
    authDisabled: readOptional(env['VITE_AUTH_DISABLED']) === 'true',
  };
}
