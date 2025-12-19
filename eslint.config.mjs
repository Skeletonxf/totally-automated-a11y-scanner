import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([{
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            ...globals.mocha,
            axs: true,
            $: true,
            browser: true,
        },

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
                modules: true,
            },
        },
    },

    rules: {
        "comma-dangle": 0,
        "no-underscore-dangle": 0,
        "no-proto": 0,

        quotes: [2, "double", {
            avoidEscape: true,
        }],

        "keyword-spacing": [2, {
            before: true,
            after: true,
        }],

        "space-infix-ops": 0,
        strict: 0,
    },
}]);
