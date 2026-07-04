module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prefer-const": "error",
    "no-var": "error",
    "import/order": ["warn", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc" }
    }],
  },
  ignorePatterns: [
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
    "*.config.*",
  ],
};
