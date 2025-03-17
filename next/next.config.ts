import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/dashboard/games/:first/edit/:path*",
				destination: "/dashboard/games/:first/edit",
			},
		];
	},

	transpilePackages: ["@ptera/schema", "@ptera/config"],

	outputFileTracingRoot: path.join(__dirname, "../"),
};

export default nextConfig;
