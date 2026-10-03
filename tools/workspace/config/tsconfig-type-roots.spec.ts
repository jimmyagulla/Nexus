import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

describe("api-e2e spec TypeScript project", () => {
  it("requests vite and vitest type packages used by the Vitest language service", () => {
    const spec = JSON.parse(
      readFileSync(
        path.join(workspaceRoot, "apps/api-e2e/tsconfig.spec.json"),
        "utf8",
      ),
    ) as { compilerOptions?: { types?: string[] } };

    expect(spec.compilerOptions?.types).toEqual([
      "node",
      "vitest/globals",
      "vitest/importMeta",
      "vite/client",
    ]);
  });

  it("typechecks e2e sources only, not the Vitest config", () => {
    const spec = JSON.parse(
      readFileSync(
        path.join(workspaceRoot, "apps/api-e2e/tsconfig.spec.json"),
        "utf8",
      ),
    ) as { include?: string[] };

    expect(spec.include).toEqual(["src/**/*.ts"]);
  });
});

describe("workspace typeRoots", () => {
  it("includes node_modules so vite and vitest type packages resolve", () => {
    const base = JSON.parse(
      readFileSync(path.join(workspaceRoot, "tsconfig.base.json"), "utf8"),
    ) as { compilerOptions?: { typeRoots?: string[] } };

    expect(base.compilerOptions?.typeRoots).toEqual([
      "./node_modules/@types",
      "./node_modules",
      "./tools/workspace/types",
    ]);
  });
});
