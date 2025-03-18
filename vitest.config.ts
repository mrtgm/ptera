import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    workspace: [
      {
        test: {
          include: ["packages/**/*.test.ts"],
          name: "node",
          environment: "node",
        },
      },
      {
        extends: true,
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./nextjs/src"),
          },
        },
        test: {
          include: ["nextjs/**/*.browser.test.{ts,js}"],
          name: "nextjs",
          environment: "jsdom",
        },
      },
      {
        extends: true,
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "./nextjs/src"),
          },
        },
        test: {
          include: ["nextjs/**/*.node.test.{ts,js}"],
          name: "nextjs-node",
          environment: "node",
        },
      },
      {
        plugins: [
          storybookTest({
            configDir: fileURLToPath(
              new URL("./nextjs/.storybook", import.meta.url),
            ),
          }),
        ],
        root: "nextjs",
        test: {
          browser: {
            enabled: true,
            headless: true,
            name: "chromium",
            provider: "playwright",
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
