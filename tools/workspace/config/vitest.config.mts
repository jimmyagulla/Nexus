import path from "node:path";
import { fileURLToPath } from "node:url";

import { createNodeVitestConfig } from "./vitest.node.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export default createNodeVitestConfig({
  root,
  name: "workspace",
  coverageDirectory: "../../coverage/tools/workspace",
  test: {
    include: ["config/**/*.{test,spec}.ts"],
  },
});
