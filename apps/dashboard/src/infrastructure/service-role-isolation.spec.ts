import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

function findWorkspaceRoot(): string {
  let directory = process.cwd();
  while (!existsSync(join(directory, 'tsconfig.base.json'))) {
    const parent = dirname(directory);
    if (parent === directory) {
      throw new Error('tsconfig.base.json not found above the current folder');
    }
    directory = parent;
  }

  return directory;
}

const workspaceRoot = findWorkspaceRoot();
const dashboardSource = join(workspaceRoot, 'apps', 'dashboard', 'src');

const SERVER_ENTRYPOINT =
  '@hexagonal-monorepo-template/infrastructure/supabase/server';
const SUPABASE_SDK = '@supabase/supabase-js';
const SERVER_PATH = /(^|\/)supabase\/server(\/|$)/;
const IMPORTED_MODULE = /(?:from|import|require)\s*\(?\s*['"]([^'"]+)['"]/g;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(path);
    }
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function importedModules(file: string): string[] {
  const contents = readFileSync(file, 'utf-8');
  return [...contents.matchAll(IMPORTED_MODULE)].map((match) => match[1]);
}

function filesImporting(predicate: (module: string) => boolean): string[] {
  return sourceFiles(dashboardSource)
    .filter((file) => importedModules(file).some(predicate))
    .map((file) => file.slice(dashboardSource.length + 1).replace(/\\/g, '/'));
}

function barrelExports(path: string): string[] {
  return importedModules(join(workspaceRoot, path));
}

function tsconfigPaths(): Record<string, string[]> {
  const tsconfig: { compilerOptions: { paths: Record<string, string[]> } } =
    JSON.parse(readFileSync(join(workspaceRoot, 'tsconfig.base.json'), 'utf-8'));
  return tsconfig.compilerOptions.paths;
}

describe('service_role isolation', () => {
  it('keeps the server entrypoint out of the dashboard sources', () => {
    expect(
      filesImporting(
        (module) => module === SERVER_ENTRYPOINT || SERVER_PATH.test(module),
      ),
    ).toEqual([]);
  });

  it('keeps the Supabase SDK out of the dashboard sources', () => {
    expect(filesImporting((module) => module === SUPABASE_SDK)).toEqual([]);
  });

  it('keeps the shared infrastructure barrel free of Supabase entrypoints', () => {
    expect(
      barrelExports('libs/infrastructure/src/index.ts').filter((module) =>
        module.includes('supabase'),
      ),
    ).toEqual([]);
  });

  it('keeps the browser entrypoint free of the admin client', () => {
    expect(
      barrelExports('libs/infrastructure/src/supabase/browser/index.ts'),
    ).toEqual(['./supabase-session-client']);
  });

  it('resolves the browser and the server entrypoints to disjoint files', () => {
    const paths = tsconfigPaths();

    expect({
      browser: paths['@hexagonal-monorepo-template/infrastructure/supabase/browser'],
      server: paths['@hexagonal-monorepo-template/infrastructure/supabase/server'],
    }).toEqual({
      browser: ['./libs/infrastructure/src/supabase/browser/index.ts'],
      server: ['./libs/infrastructure/src/supabase/server/index.ts'],
    });
  });
});
