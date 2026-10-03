import { createNodesFromFiles } from "@nx/devkit";

import { inferHexagonalLibProject } from "./hexagonal-libs.mjs";

export const createNodes = [
  "libs/*/src/index.ts",
  (configFiles, options, context) =>
    createNodesFromFiles(
      (configFile) => inferHexagonalLibProject(configFile),
      configFiles,
      options,
      context,
    ),
];

export const createNodesV2 = createNodes;
