import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

describe("libs spec TypeScript project", () => {
  it("includes vitest globals so layer specs typecheck in the IDE", () => {
    const spec = JSON.parse(
      readFileSync(path.join(workspaceRoot, "libs/tsconfig.spec.json"), "utf8"),
    );

    expect(spec.extends).toBe("../tools/workspace/tsconfig.spec.json");
    expect(spec.include).toEqual([
      "./*/src/**/*.spec.ts",
      "./*/src/**/*.test.ts",
    ]);
  });
});
