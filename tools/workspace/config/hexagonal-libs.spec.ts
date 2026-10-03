import { inferHexagonalLibProject } from "./hexagonal-libs.mjs";

describe("inferHexagonalLibProject", () => {
  it("creates a domain library tagged layer:domain", () => {
    const result = inferHexagonalLibProject("libs/domain/src/index.ts");
    const project = result.projects["libs/domain"];

    expect(project).toMatchObject({
      name: "domain",
      root: "libs/domain",
      sourceRoot: "libs/domain/src",
      projectType: "library",
      tags: ["layer:domain"],
    });
  });

  it.each([
    ["ports", "layer:port"],
    ["application", "layer:application"],
    ["adapters", "layer:adapter"],
    ["infrastructure", "layer:infra"],
  ])("tags libs/%s as %s", (layer, tag) => {
    const result = inferHexagonalLibProject(`libs/${layer}/src/index.ts`);
    const project = result.projects[`libs/${layer}`];

    expect(project).toMatchObject({
      name: layer,
      tags: [tag],
    });
  });

  it("rejects an unknown layer so untagged libs cannot bypass depConstraints", () => {
    expect(() => inferHexagonalLibProject("libs/shared/src/index.ts")).toThrow(
      /Unknown hexagonal layer "shared" at libs\/shared/,
    );
  });

  it("adds lint, test, and typecheck targets that use workspace configs", () => {
    const { targets } = inferHexagonalLibProject("libs/domain/src/index.ts")
      .projects["libs/domain"];

    expect(targets.lint.command).toBe("eslint .");
    expect(targets.lint.options.cwd).toBe("{projectRoot}");
    expect(targets.test.command).toBe(
      "vitest run --config ../../tools/workspace/config/vitest.layer.mjs",
    );
    expect(targets.test.options.cwd).toBe("{projectRoot}");
    expect(targets.typecheck.command).toContain("tools/workspace/config/typecheck-lib.mjs");
    expect(targets.typecheck.command).toContain("{projectRoot}");
    expect(targets.typecheck.inputs).toContain(
      "{workspaceRoot}/tools/workspace/tsconfig.spec.json",
    );
  });
});
