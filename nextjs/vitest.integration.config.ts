import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    exclude: ["**/node_modules/**", ".next/**"],
    testTransformMode: { ssr: ["**/*"] },
    testTimeout: 20000,
    retry: 0,
    cache: {
      dir: ".vitest-cache",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "coverage/**",
        "dist/**",
        "**/node_modules/**",
        "test/**",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@ptera/config": resolve(__dirname, "./packages/config/src"),
      "@ptera/schema": resolve(__dirname, "./packages/schema/src"),
    },
  },
});
