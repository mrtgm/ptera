import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const DEV_API_URL = "http://localhost:3000/api/openapi.json";

const OUTPUT_DIR = path.resolve(__dirname, "../src/client/api/generated");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

try {
  console.log("🚀 APIクライアントを生成中...");
  const apiUrl = DEV_API_URL;
  execSync(
    `bunx openapi --input ${apiUrl} --output ${OUTPUT_DIR} --client fetch --name PteraApiClient`,
    { stdio: "inherit" },
  );
  console.log("✅ APIクライアント生成完了");
} catch (error) {
  console.error("❌ APIクライアント生成中にエラーが発生しました:", error);
  process.exit(1);
}
