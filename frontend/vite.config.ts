import { vitePlugin as remix } from "@remix-run/dev";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { flatRoutes } from "remix-flat-routes";
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
					routes: (defineRoutes) => {
						return flatRoutes("routes", defineRoutes, {
							ignoredRouteFiles: [
								".*",
								"**/*.css",
								"**/*.test.{js,jsx,ts,tsx}",
								"**/__*.*",
								// This is for server-side utilities you want to colocate
								// next to your routes without making an additional
								// directory. If you need a route that includes "server" or
								// "client" in the filename, use the escape brackets like:
								// my-route.[server].tsx
								"**/*.server.*",
								"**/*.client.*",
							],
						});
					},
				})
			: react(),
		tsconfigPaths(),
		sentryVitePlugin({
			authToken: loadEnv("", process.cwd()).VITE_SENTRY_AUTH_TOKEN,
			org: loadEnv("", process.cwd()).VITE_SENTRY_ORG,
			project: loadEnv("", process.cwd()).VITE_SENTRY_PROJECT,
		}),
	],

	test: {
		environment: "jsdom",
		setupFiles: ["./setup-vitest.ts"],
		globals: true,
	},

	build: {
		sourcemap: true,
	},
});
