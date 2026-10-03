import type { ConfigEnv, UserConfig } from "vitest/config";

export function createNodeVitestConfig(options: {
  name: string;
  coverageDirectory: string;
  importMetaUrl?: string;
  root?: string;
  test?: Record<string, unknown>;
}): (env: ConfigEnv) => UserConfig;
