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
