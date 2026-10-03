import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vitest/config";

function findWorkspaceRoot(fromDir) {
  if (process.env.NX_WORKSPACE_ROOT) {
    return process.env.NX_WORKSPACE_ROOT;
  }

  let dir = fromDir;
  while (true) {
    if (existsSync(path.join(dir, "nx.json"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(`nx.json not found from ${fromDir}`);
    }
    dir = parent;
  }
}

/**
 * @param {{
 *   name: string,
 *   coverageDirectory: string,
 *   importMetaUrl?: string,
 *   root?: string,
 *   test?: Record<string, unknown>,
 * }} options
 */
export function createNodeVitestConfig({
  importMetaUrl,
  root: rootOption,
  name,
  coverageDirectory,
  test = {},
}) {
  const root = rootOption ?? path.dirname(fileURLToPath(importMetaUrl));
  const workspaceRoot = findWorkspaceRoot(root);
  const { coverage, ...testOverrides } = test;

  return defineConfig(() => ({
    root,
    cacheDir: path.join(workspaceRoot, "node_modules/.vite", name),
    resolve: {
      tsconfigPaths: true,
    },
    test: {
      name,
      watch: false,
      globals: true,
      environment: "node",
      passWithNoTests: true,
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      reporters: ["default"],
      coverage: {
        reportsDirectory: path.resolve(root, coverageDirectory),
        provider: "v8",
        ...coverage,
      },
      ...testOverrides,
    },
  }));
}
