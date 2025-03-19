#!/usr/bin/env bun

/**
 * Favicon Generator Script for Bun
 * Usage:
 *   bun run generate-favicon.js <source-image> [output-dir]
 *
 * Example:
 *   bun run generate-favicon.js logo.png ./public
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import * as ico from "sharp-ico";
const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    output: {
      type: "string",
      short: "o",
      default: "./public",
    },
    fit: {
      type: "string",
      short: "f",
      default: "contain",
    },
    background: {
      type: "string",
      short: "b",
      default: "transparent",
    },
  },
  allowPositionals: true,
});

if (positionals.length === 0) {
  console.error("Error: Source image path is required");
  console.log("Usage: bun run generate-favicon.js <source-image> [output-dir]");
  console.log("Options:");
  console.log("  -o, --output <dir>     Output directory (default: ./public)");
  console.log(
    "  -f, --fit <mode>       Fit mode: contain, cover, fill, inside, outside (default: contain)",
  );
  console.log(
    '  -b, --background <color> Background color (hex: #RRGGBB or "transparent")',
  );
  process.exit(1);
}

const sourceImage = positionals[0];
const outputDir = values.output || positionals[1] || "./public";
const fitMode = values.fit || "contain"; // Options: contain, cover, fill, inside, outside
const bgColor = values.background || "transparent";

let background: { r: number; g: number; b: number; alpha: number };
if (bgColor === "transparent") {
  background = { r: 0, g: 0, b: 0, alpha: 0 };
} else if (bgColor.startsWith("#")) {
  const hex = bgColor.substring(1);
  const r = Number.parseInt(hex.substring(0, 2), 16);
  const g = Number.parseInt(hex.substring(2, 4), 16);
  const b = Number.parseInt(hex.substring(4, 6), 16);
  background = { r, g, b, alpha: 1 };
} else {
  // デフォルトは透明
  background = { r: 0, g: 0, b: 0, alpha: 0 };
}

const FAVICON_CONFIGS = [
  { name: "favicon.ico", sizes: [16, 32], format: "ico" },
  { name: "favicon-16x16.png", sizes: [16], format: "png" },
  { name: "favicon-32x32.png", sizes: [32], format: "png" },
  { name: "favicon-48x48.png", sizes: [48], format: "png" },
  { name: "apple-touch-icon.png", sizes: [180], format: "png" },
  { name: "icon-192x192.png", sizes: [192], format: "png" },
  { name: "icon-512x512.png", sizes: [512], format: "png" },
];

async function main() {
  try {
    await mkdir(outputDir, { recursive: true });
    console.log(`Output directory: ${outputDir}`);

    const sourceBuffer = await Bun.file(sourceImage).arrayBuffer();
    console.log(`Processing source image: ${sourceImage}`);

    // 画像のメタデータを取得
    const metadata = await sharp(sourceBuffer).metadata();
    console.log(
      `Original image dimensions: ${metadata.width}x${metadata.height}`,
    );

    // 正方形かどうか
    const isSquare = metadata.width === metadata.height;
    if (!isSquare) {
      console.log(
        `Image is not square (${metadata.width}x${metadata.height}). Using fit mode: ${fitMode} with ${bgColor === "transparent" ? "transparent" : bgColor} background.`,
      );
    }

    for (const config of FAVICON_CONFIGS) {
      const { name, sizes, format } = config;
      const outputPath = join(outputDir, name);

      if (format === "ico") {
        // それぞれのサイズ用の PNG バッファを一時生成
        const sharpInstances = [];
        for (const size of sizes) {
          // 正方形にリサイズ
          const sharpInstance = sharp(sourceBuffer).resize(size, size, {
            fit: fitMode as keyof sharp.FitEnum,
            background: background,
          });

          sharpInstances.push(sharpInstance);
        }

        // ICO ファイルを生成
        try {
          await ico.sharpsToIco(sharpInstances, outputPath);
          console.log(`Generated: ${name} (with sizes: ${sizes.join(", ")})`);
        } catch (error) {
          console.error(
            `Error generating ICO file: ${(error as Error).message}`,
          );
          // ICO ファイルの生成に失敗した場合、PNG にフォールバック
          for (let i = 0; i < sizes.length; i++) {
            const size = sizes[i];
            const pngBuffer = await sharpInstances[i]
              .toFormat("png")
              .toBuffer();
            const pngOutputPath = join(
              outputDir,
              `favicon-${size}x${size}.png`,
            );
            await writeFile(pngOutputPath, pngBuffer);
            console.log(`Generated fallback: favicon-${size}x${size}.png`);
          }
        }
      } else {
        // 他のフォーマットの場合はリサイズして保存
        const buffer = await sharp(sourceBuffer)
          .resize(sizes[0], sizes[0], {
            fit: fitMode as keyof sharp.FitEnum,
            background: background,
          })
          .toFormat(format as keyof sharp.FormatEnum)
          .toBuffer();

        await writeFile(outputPath, buffer);
      }

      console.log(`Generated: ${name}`);
    }

    // SVG なら保持
    if (sourceImage.toLowerCase().endsWith(".svg")) {
      const svgOutputPath = join(outputDir, "favicon.svg");
      await Bun.write(svgOutputPath, Bun.file(sourceImage));
      console.log("Generated: favicon.svg");
    }

    console.log("\nFavicon generation complete!");
    console.log("\nAdd the following to your Next.js metadata:");
    console.log(`
// In app/layout.tsx:
export const metadata = {
  icons: {
    icon: [
      { rel: 'icon', url: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '48x48', url: '/favicon-48x48.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', url: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/icon-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '512x512', url: '/icon-512x512.png' },
    ],
  },
};`);
  } catch (error) {
    console.error("Error generating favicons:", error);
    process.exit(1);
  }
}

main().catch(console.error);
