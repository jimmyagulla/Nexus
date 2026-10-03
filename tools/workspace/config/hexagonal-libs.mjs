export const HEXAGONAL_LAYER_TAGS = {
  domain: ["layer:domain"],
  ports: ["layer:port"],
  application: ["layer:application"],
  adapters: ["layer:adapter"],
  infrastructure: ["layer:infra"],
};

export function inferHexagonalLibProject(indexFile) {
  const projectRoot = indexFile.replace(/\/src\/index\.ts$/, "");
  const layerName = projectRoot.split("/").at(-1);
  const tags = HEXAGONAL_LAYER_TAGS[layerName];
  if (!tags) {
    throw new Error(
      `Unknown hexagonal layer "${layerName}" at ${projectRoot}. Add it to HEXAGONAL_LAYER_TAGS or remove src/index.ts.`,
    );
  }

  return {
    projects: {
      [projectRoot]: {
        name: layerName,
        root: projectRoot,
        sourceRoot: `${projectRoot}/src`,
        projectType: "library",
        tags,
        targets: {
          lint: {
            command: "eslint .",
            options: {
              cwd: "{projectRoot}",
            },
            cache: true,
            inputs: [
              "default",
              "{workspaceRoot}/eslint.config.mjs",
              "{workspaceRoot}/tools/workspace/config/eslint.base.mjs",
            ],
          },
          test: {
            command:
              "vitest run --config ../../tools/workspace/config/vitest.layer.mjs",
            options: {
              cwd: "{projectRoot}",
            },
            cache: true,
            inputs: [
              "default",
              "{workspaceRoot}/tools/workspace/config/vitest.layer.mjs",
              "{workspaceRoot}/tools/workspace/config/vitest.node.mjs",
            ],
            outputs: ["{workspaceRoot}/coverage/{projectRoot}"],
          },
          typecheck: {
            command: "node tools/workspace/config/typecheck-lib.mjs {projectRoot}",
            cache: true,
            inputs: [
              "default",
              "{workspaceRoot}/tools/workspace/tsconfig.json",
              "{workspaceRoot}/tools/workspace/tsconfig.lib.json",
              "{workspaceRoot}/tools/workspace/tsconfig.spec.json",
              "{workspaceRoot}/tsconfig.base.json",
            ],
          },
        },
      },
    },
  };
}
