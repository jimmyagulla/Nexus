import {
  parseBool,
  parsePort,
  readOptional,
} from '@hexagonal-monorepo-template/infrastructure';

export type ApiConfig = {
  port: number;
  authAllowed: boolean;
  globalPrefix: string;
};

export const API_CONFIG = Symbol('API_CONFIG');

export function loadApiConfig(
  env: Record<string, string | undefined> = process.env,
): ApiConfig {
  const rawPrefix = env.API_GLOBAL_PREFIX;

  if (rawPrefix !== undefined && readOptional(rawPrefix) === undefined) {
    throw new Error('Invalid API_GLOBAL_PREFIX: value is empty');
  }

  return {
    port: parsePort(env.PORT, 3000),
    authAllowed: parseBool(env.AUTH_ALLOWED, true),
    globalPrefix: readOptional(rawPrefix) ?? 'api',
  };
}
