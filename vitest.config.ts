import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.spec.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/tests/e2e/**"],
    alias: {
      "@tech-inject/registry-schema": path.resolve(
        __dirname,
        "packages/registry-schema/src",
      ),
      "@tech-inject/theme": path.resolve(__dirname, "packages/theme/src"),
      "@tech-inject/db": path.resolve(__dirname, "packages/db/src"),
      "@tech-inject/ui": path.resolve(__dirname, "packages/ui/src"),
      "@tech-inject/cli": path.resolve(__dirname, "packages/cli/src"),
    },
  },
});
