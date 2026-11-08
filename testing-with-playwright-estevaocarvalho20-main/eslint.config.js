import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["dist", "node_modules", "test-results", "playwright-report"],
  },
  {
    files: ["**/*.{js,ts}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
];
