import reactHooks from "eslint-plugin-react-hooks";
import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        plugins: {
            "react-hooks": reactHooks,
        },
        // @nx/eslint-plugin flat/react loads eslint-plugin-react, which crashes on ESLint 10.
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "error",
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "@supabase/supabase-js",
                            message: "Only libs/infrastructure/src/supabase owns the Supabase SDK. Import @hexagonal-monorepo-template/infrastructure/supabase/browser instead.",
                        },
                        {
                            name: "@hexagonal-monorepo-template/infrastructure/supabase/server",
                            message: "The server entrypoint carries the service_role key. The browser bundle must only reach @hexagonal-monorepo-template/infrastructure/supabase/browser.",
                        },
                    ],
                    patterns: [
                        {
                            group: ["**/supabase/server", "**/supabase/server/**"],
                            message: "The server entrypoint carries the service_role key. The browser bundle must only reach @hexagonal-monorepo-template/infrastructure/supabase/browser.",
                        },
                    ],
                },
            ],
        },
    },
];
