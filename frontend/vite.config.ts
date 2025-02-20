import { vitePlugin as remix } from "@remix-run/dev";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
	interface Future {
		v3_singleFetch: true;
	}
}

export default defineConfig({
	plugins: [
		!process.env.VITEST
			? remix({
					ssr: false,
					future: {
						v3_fetcherPersist: true,
						v3_relativeSplatPath: true,
						v3_throwAbortReason: true,
						v3_singleFetch: true,
						v3_lazyRouteDiscovery: true,
					},
				})
			: react(),
		tsconfigPaths(),
	],
	test: {
		environment: "jsdom",
		setupFiles: ["./setup-vitest.ts"],
		globals: true,
	},
});
