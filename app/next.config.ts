import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: "/dashboard/games/:first/edit/:path*",
				destination: "/dashboard/games/:first/edit",
			},
		];
	},
};

export default nextConfig;
