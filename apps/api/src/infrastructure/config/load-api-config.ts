import {
  parsePersistence,
  parsePort,
  readOptional,
} from '@hexagonal-monorepo-template/infrastructure';

export type PersistenceMode = 'memory' | 'postgres';

export type ApiConfig = {
  port: number;
  globalPrefix: string;
  persistence: PersistenceMode;
  databaseUrl?: string;
  directUrl?: string;
  supabaseUrl?: string;
  supabaseJwksUrl?: string;
  supabaseServiceRoleKey?: string;
};

export const API_CONFIG = Symbol('API_CONFIG');

export function loadApiConfig(
  env: Record<string, string | undefined> = process.env,
): ApiConfig {
  const rawPrefix = env.API_GLOBAL_PREFIX;
  if (rawPrefix !== undefined && readOptional(rawPrefix) === undefined) {
    throw new Error('Invalid API_GLOBAL_PREFIX: value is empty');
  }

  const persistence = parsePersistence(env.PERSISTENCE, 'memory');
  const databaseUrl = readOptional(env.DATABASE_URL);
  const directUrl = readOptional(env.DIRECT_URL);
  const supabaseUrl = readOptional(env.SUPABASE_URL);
  const supabaseJwksUrl = readOptional(env.SUPABASE_JWKS_URL);
  const supabaseServiceRoleKey = readOptional(env.SUPABASE_SERVICE_ROLE_KEY);

  if (persistence === 'postgres' && databaseUrl === undefined) {
    throw new Error('Invalid DATABASE_URL: value is empty');
  }

  return {
    port: parsePort(env.PORT, 3000),
    globalPrefix: readOptional(rawPrefix) ?? 'api',
    persistence,
    databaseUrl,
    directUrl,
    supabaseUrl,
    supabaseJwksUrl,
    supabaseServiceRoleKey,
  };
}
