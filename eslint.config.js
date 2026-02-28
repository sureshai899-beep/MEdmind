const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const reactNativePlugin = require("eslint-plugin-react-native");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: tsparser,
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tseslint,
            react: reactPlugin,
            "react-native": reactNativePlugin,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
            "react-native/no-unused-styles": "error",
            "react-native/split-platform-components": "error",
            "react-native/no-inline-styles": "error",
            "react-native/no-color-literals": "error",
            "react-native/no-raw-text": "error",
            "react-native/no-single-element-style-arrays": "error",
            "@typescript-eslint/no-shadow": ["error"],
            "no-shadow": "off",
            "no-undef": "off",
            "react/react-in-jsx-scope": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    prettierConfig,
];
