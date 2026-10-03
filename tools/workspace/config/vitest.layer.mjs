import path from "node:path";

import { createNodeVitestConfig } from "./vitest.node.mjs";

const root = process.cwd();
const name = path.basename(root);

export default createNodeVitestConfig({
  root,
  name,
  coverageDirectory: path.join("..", "..", "coverage", "libs", name),
});
