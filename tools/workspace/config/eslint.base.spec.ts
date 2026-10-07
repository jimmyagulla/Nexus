import path from "node:path";
import { fileURLToPath } from "node:url";

import { ESLint } from "eslint";

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

describe("inner hexagonal layer lint", () => {
  it("rejects NestJS imports in application use cases without the Nx project graph", async () => {
    const eslint = new ESLint({ cwd: workspaceRoot });

    const [result] = await eslint.lintText(
      `import { Injectable } from "@nestjs/common";\n`,
      {
        filePath: path.join(
          workspaceRoot,
          "libs/application/src/use-cases/probe.ts",
        ),
      },
    );

    const ruleIds = result.messages.map((message) => message.ruleId);

    expect(ruleIds, JSON.stringify(result.messages, null, 2)).toContain(
      "no-restricted-imports",
    );
  });

  it("rejects NestJS imports when ESLint cwd is the application project root", async () => {
    const applicationRoot = path.join(workspaceRoot, "libs/application");
    const eslint = new ESLint({ cwd: applicationRoot });

    const [result] = await eslint.lintText(
      `import { Injectable } from "@nestjs/common";\n`,
      {
        filePath: path.join(applicationRoot, "src/use-cases/probe.ts"),
      },
    );

    const ruleIds = result.messages.map((message) => message.ruleId);

    expect(ruleIds, JSON.stringify(result.messages, null, 2)).toContain(
      "no-restricted-imports",
    );
  });
});

describe("test file lint category", () => {
  const applicationLayerConstraintFor = async (fileName: string) => {
    const eslint = new ESLint({ cwd: workspaceRoot });

    const config = await eslint.calculateConfigForFile(
      path.join(workspaceRoot, "libs/application/src/use-cases", fileName),
    );
    const [, options] = config.rules["@nx/enforce-module-boundaries"];

    return options.depConstraints.find(
      (constraint: { sourceTag: string }) =>
        constraint.sourceTag === "layer:application",
    );
  };

  it.each([
    "probe.spec.ts",
    "probe.spec.tsx",
    "probe.test.ts",
    "probe.test.tsx",
  ])(
    "lets %s reach any layer and any test tooling to build its harness",
    async (fileName) => {
      expect(await applicationLayerConstraintFor(fileName)).toEqual({
        sourceTag: "layer:application",
        onlyDependOnLibsWithTags: [
          "layer:domain",
          "layer:port",
          "layer:application",
          "layer:adapter",
          "layer:infra",
        ],
      });
    },
  );

  it("keeps outer layers and external packages out of production code", async () => {
    expect(await applicationLayerConstraintFor("probe.ts")).toEqual({
      sourceTag: "layer:application",
      onlyDependOnLibsWithTags: ["layer:domain", "layer:port"],
      bannedExternalImports: ["*"],
    });
  });

  it("still rejects technical packages in an application spec", async () => {
    const eslint = new ESLint({ cwd: workspaceRoot });

    const [result] = await eslint.lintText(
      `import { Injectable } from "@nestjs/common";\n`,
      {
        filePath: path.join(
          workspaceRoot,
          "libs/application/src/use-cases/probe.spec.ts",
        ),
      },
    );

    const ruleIds = result.messages.map((message) => message.ruleId);

    expect(ruleIds, JSON.stringify(result.messages, null, 2)).toContain(
      "no-restricted-imports",
    );
  });
});
