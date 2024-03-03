module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    // Add TypeScript-specific configurations
    "plugin:@typescript-eslint/recommended", // TypeScript rules
    "plugin:@typescript-eslint/eslint-recommended", // Adjusts some rules from eslint:recommended for TS
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser", // Use the TypeScript parser for ESLint
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: { version: "detect" }, // Automatically detect the React version
  },
  plugins: [
    "react-refresh",
    "@typescript-eslint", // Add TypeScript plugin
  ],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // Add or override TypeScript-specific rules here
  },
};
