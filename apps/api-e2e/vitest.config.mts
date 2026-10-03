import { createNodeVitestConfig } from "@hexagonal-monorepo-template/workspace/vitest/node";

export default createNodeVitestConfig({
  importMetaUrl: import.meta.url,
  name: "api-e2e",
  coverageDirectory: "../../coverage/api-e2e",
  test: {
    globalSetup: ["./src/support/global-setup.ts"],
    globalTeardown: ["./src/support/global-teardown.ts"],
    setupFiles: ["./src/support/test-setup.ts"],
  },
});
