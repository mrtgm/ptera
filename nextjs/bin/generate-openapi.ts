#!/usr/bin/env bun

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { OpenAPIHono } from "@hono/zod-openapi";
import { ENV } from "@ptera/config";
import { Hono } from "hono";
import app from "../src/server/core/server";
import { docs, openApiSettings } from "../src/server/lib/doc";

async function main() {
  const outputDir = join(process.cwd(), "doc", "api");
  const outputFilePath = join(outputDir, "openapi.json");

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  docs(app);

  try {
    const openAPISchema = app.getOpenAPI31Document(openApiSettings);
    writeFileSync(
      outputFilePath,
      JSON.stringify(openAPISchema, null, 2),
      "utf-8",
    );

    console.log(`OpenAPI スキーマが保存されました: ${outputFilePath}`);
  } catch (error) {
    console.error("OpenAPI スキーマの保存に失敗しました:", error);
    process.exit(1);
  }
}

main().catch(console.error);
