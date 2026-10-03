import { describe, expect, it } from "vitest";

import { createNodeVitestConfig } from "./vitest.node.mjs";

describe("createNodeVitestConfig", () => {
  it("resolves TypeScript paths with Vite native tsconfigPaths instead of the deprecated Nx plugin", async () => {
    const config = await createNodeVitestConfig({
      importMetaUrl: import.meta.url,
      name: "workspace",
      coverageDirectory: "../../coverage/tools/workspace",
    })({ command: "serve", mode: "test" });

    const pluginNames = (config.plugins ?? []).flatMap((plugin: unknown) => {
      if (Array.isArray(plugin)) {
        return plugin.map((inner: unknown) =>
          inner && typeof inner === "object" && "name" in inner
            ? inner.name
            : undefined,
        );
      }

      return plugin && typeof plugin === "object" && "name" in plugin
        ? [plugin.name]
        : [undefined];
    });

    expect(config.resolve?.tsconfigPaths).toBe(true);
    expect(pluginNames).not.toContain("nx-vite-ts-paths");
    expect(pluginNames).not.toContain("vite-tsconfig-paths");
  });
});
