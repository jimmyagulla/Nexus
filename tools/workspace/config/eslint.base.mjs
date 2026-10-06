import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import nx from "@nx/eslint-plugin";

const testFiles = [
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/*.test.ts",
    "**/*.test.tsx"
];

const hexagonalLayerTags = [
    "layer:domain",
    "layer:port",
    "layer:application",
    "layer:adapter",
    "layer:infra"
];

const moduleBoundaryAllow = [
    "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
];

export default [
    comments.recommended,
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
        ignores: [
            "**/dist",
            "**/out-tsc",
            "**/prisma-client/**"
        ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: false,
                    allow: moduleBoundaryAllow,
                    depConstraints: [
                        {
                            sourceTag: "layer:domain",
                            onlyDependOnLibsWithTags: [],
                            bannedExternalImports: ["*"]
                        },
                        {
                            sourceTag: "layer:port",
                            onlyDependOnLibsWithTags: ["layer:domain"],
                            bannedExternalImports: ["*"]
                        },
                        {
                            sourceTag: "layer:application",
                            onlyDependOnLibsWithTags: ["layer:domain", "layer:port"],
                            bannedExternalImports: ["*"]
                        },
                        {
                            sourceTag: "layer:adapter",
                            onlyDependOnLibsWithTags: ["layer:domain", "layer:port", "layer:infra"]
                        },
                        {
                            sourceTag: "layer:infra",
                            onlyDependOnLibsWithTags: []
                        },
                        {
                            sourceTag: "type:tool",
                            onlyDependOnLibsWithTags: []
                        },
                        {
                            sourceTag: "type:app",
                            onlyDependOnLibsWithTags: [
                                "layer:domain",
                                "layer:port",
                                "layer:application",
                                "layer:adapter",
                                "layer:infra",
                                "type:tool"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        // Test files form their own category: layer boundaries constrain how production
        // code is wired, so a spec may reach any layer and any test tooling to build its
        // harness. Every other restriction below still applies to specs.
        files: testFiles,
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: false,
                    allow: moduleBoundaryAllow,
                    depConstraints: [
                        ...hexagonalLayerTags.map((sourceTag) => ({
                            sourceTag,
                            onlyDependOnLibsWithTags: hexagonalLayerTags
                        })),
                        {
                            sourceTag: "type:tool",
                            onlyDependOnLibsWithTags: []
                        },
                        {
                            sourceTag: "type:app",
                            onlyDependOnLibsWithTags: [
                                ...hexagonalLayerTags,
                                "type:tool"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx"
        ],
        ignores: [
            "**/libs/infrastructure/src/supabase/**/*.ts"
        ],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "@supabase/supabase-js",
                            message: "Only libs/infrastructure/src/supabase owns the Supabase SDK. Import @hexagonal-monorepo-template/infrastructure/supabase/browser or /server instead."
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/libs/domain/**/*.ts",
            "**/libs/ports/**/*.ts",
            "**/libs/application/**/*.ts"
        ],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            regex: "^(?![.]|@hexagonal-monorepo-template/|vitest(?:/|$)).+",
                            message: "domain, ports, and application may only import relative modules or hexagonal workspace libs. Technical packages belong in adapters or the app composition root."
                        }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        linterOptions: {
            reportUnusedDisableDirectives: "error"
        },
        rules: {
            "@eslint-community/eslint-comments/no-unlimited-disable": "error",
            "@eslint-community/eslint-comments/no-unused-disable": "error",
            "@eslint-community/eslint-comments/require-description": "error",
            "@eslint-community/eslint-comments/no-use": [
                "error",
                {
                    allow: [
                        "eslint-disable-next-line"
                    ]
                }
            ]
        }
    }
];
