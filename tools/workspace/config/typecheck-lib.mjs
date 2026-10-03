import path from "node:path";
import process from "node:process";
import ts from "typescript";

const projectRootArg = process.argv[2];
if (!projectRootArg) {
  console.error("Usage: typecheck-lib.mjs <projectRoot>");
  process.exit(1);
}

const workspaceRoot = process.cwd();
const configDir = path.join(workspaceRoot, "tools/workspace");
const projectRoot = path.resolve(workspaceRoot, projectRootArg);
const srcGlob = path
  .relative(configDir, path.join(projectRoot, "src"))
  .replaceAll("\\", "/");

function typecheck({ configFileName, include, exclude }) {
  const configPath = path.join(configDir, configFileName);
  const readResult = ts.readConfigFile(configPath, ts.sys.readFile);

  if (readResult.error) {
    console.error(
      ts.flattenDiagnosticMessageText(readResult.error.messageText, "\n"),
    );
    process.exit(1);
  }

  const parsed = ts.parseJsonConfigFileContent(
    {
      ...readResult.config,
      include,
      exclude,
    },
    ts.sys,
    configDir,
    undefined,
    configPath,
  );

  if (parsed.errors.length > 0) {
    for (const diagnostic of parsed.errors) {
      console.error(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
      );
    }
    process.exit(1);
  }

  if (parsed.fileNames.length === 0) {
    return;
  }

  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: { ...parsed.options, noEmit: true },
  });
  const host = {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => workspaceRoot,
    getNewLine: () => ts.sys.newLine,
  };
  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length > 0) {
    console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
    process.exit(1);
  }
}

typecheck({
  configFileName: "tsconfig.lib.json",
  include: [`${srcGlob}/**/*.ts`],
  exclude: [`${srcGlob}/**/*.spec.ts`, `${srcGlob}/**/*.test.ts`],
});

typecheck({
  configFileName: "tsconfig.spec.json",
  include: [`${srcGlob}/**/*.spec.ts`, `${srcGlob}/**/*.test.ts`],
  exclude: [],
});
