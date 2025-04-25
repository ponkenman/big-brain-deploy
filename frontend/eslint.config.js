import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginCypress from "eslint-plugin-cypress/flat";
// import stylistic from "@stylistic/eslint-plugin"

export default [
  { ignores: ["dist", "src/__test__", "**/*config.js"] },
  js.configs.recommended, ...tseslint.configs.recommended, 
  pluginCypress.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "off",
      // Note: following removed as incompatible with typescript
      // "no-unused-vars": ["error", { 
      //   "argsIgnorePattern": "^_",
      //   "caughtErrorsIgnorePattern": "^_"
      // }
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],
      "react/no-unstable-nested-components": ["error", { allowAsProps: true }],
      "prefer-arrow-callback": [
        "error",
        {
          allowNamedFunctions: true,
        },
      ],
      "react/jsx-one-expression-per-line": "off",
      indent: ["error", 2],
      "react/prop-types": "off",
      //"@stylistic/jsx-quotes": ["error", "prefer-double"],
    },
  },
];
