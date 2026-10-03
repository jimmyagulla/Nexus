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
];
