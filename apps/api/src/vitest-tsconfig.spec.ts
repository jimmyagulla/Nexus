import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const specTsconfig = JSON.parse(
  readFileSync(path.join(process.cwd(), "tsconfig.spec.json"), "utf8"),
) as { compilerOptions?: { types?: string[] } };

describe("api spec tsconfig", () => {
  it("requests vitest globals so specs typecheck in the IDE", () => {
    expect(specTsconfig.compilerOptions?.types).toEqual([
      "node",
      "vitest/globals",
    ]);
  });
});
