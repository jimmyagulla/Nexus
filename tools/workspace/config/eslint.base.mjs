import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import nx from "@nx/eslint-plugin";

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
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
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
