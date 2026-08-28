import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-console": "error",
      // ── Cyclomatic complexity enforcement ───────────────────────
      // ESLint's built-in `complexity` rule counts decision points
      // (if, else if, for, while, case, catch, &&, ||, ?:, nullish
      // coalescing). Max 10 keeps functions maintainable and forces
      // decomposition. Any function exceeding this must be refactored
      // into smaller, single-responsibility helpers.
      complexity: ["error", 10],
      // Max 4 levels of nesting inside any block. Deeper nesting
      // signals a need for early returns / guard clauses.
      "max-depth": ["error", 4],
      // Max 3 parameters — force object params for more.
      "max-params": ["error", 3],
      // Max 100 lines per function (including blank lines/comments).
      // Warn for existing code; new code must stay under 100.
      "max-lines-per-function": ["warn", 100],
      // Max 20 statements per function (excludes declarations).
      "max-statements": ["warn", 20],
    },
  },
  {
    files: ["src/lib/logger.ts", "scripts/**/*.ts", "prisma/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  // Prisma generated client, seed scripts, existing server actions, and
  // pre-existing scripts may exceed function limits. New admin code must comply.
  {
    files: [
      "prisma/**/*.ts",
      "src/lib/prisma.ts",
      "src/data/properties.ts",
      "src/actions/contact.ts",
      "src/actions/enquiry.ts",
      "src/actions/landlord.ts",
      "src/components/Navbar.tsx",
      "scripts/**/*.ts",
    ],
    rules: {
      "max-lines-per-function": "off",
      "max-statements": "off",
      complexity: "off",
      "max-depth": "off",
    },
  },
  // Test files: relax complexity rules (test setup functions are naturally long)
  {
    files: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "e2e/**/*.ts",
      "vitest.setup.ts",
      "vitest.config.ts",
      "playwright.config.ts",
    ],
    rules: {
      "max-lines-per-function": "off",
      "max-statements": "off",
      complexity: "off",
      "max-depth": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Prisma generated client is not linted.
    "node_modules/.prisma/**",
    "prisma/migrations/**",
    // Test coverage output
    "coverage/**",
    // Playwright output
    "test-results/**",
    "playwright-report/**",
    "blob-report/**",
  ]),
]);

export default eslintConfig;
