import { swaggerUI } from "@hono/swagger-ui";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import type { MiddlewareHandler } from "hono";
import { ENV } from "~/configs/env";
import type { Env } from "./context";

const commonModulesList = [
	{
		name: "auth",
		description: "認証関連のAPI",
	},
];

export const docs = (app: OpenAPIHono<Env>) => {
	const registry = app.openAPIRegistry;

	registry.registerComponent("securitySchemes", "jwtAuth", {
		type: "http",
		scheme: "bearer",
	});

	// OpenAPI
	app.doc31("/openapi.json", {
		servers: [{ url: ENV.BACKEND_URL }],
		info: {
			title: "Ptera API",
			version: ENV.API_VERSION,
			description: "PteraのAPIドキュメント",
		},
		openapi: "3.1.0",
		tags: commonModulesList,
		security: [{ cookieAuth: [] }],
	});

	// Swagger UI
	app.get(
		"/docs",
		swaggerUI({
			url: "/openapi.json",
			title: "Ptera API",
		}),
	);
};
type NonEmptyArray<T> = readonly [T, ...T[]];

type RouteOptions = Parameters<typeof createRoute>[0] & {
	guard: MiddlewareHandler | NonEmptyArray<MiddlewareHandler>;
	middleware?: MiddlewareHandler<Env> | NonEmptyArray<MiddlewareHandler<Env>>;
};
type Route<
	P extends string,
	R extends Omit<RouteOptions, "path"> & { path: P },
> = ReturnType<typeof createRoute<P, Omit<R, "guard">>>;

export const createRouteConfig = <
	P extends string,
	R extends Omit<RouteOptions, "path"> & { path: P },
>({
	guard,
	...routeConfig
}: R): Route<P, R> => {
	const initGuard = Array.isArray(guard) ? guard : [guard];
	const initMiddleware = routeConfig.middleware
		? Array.isArray(routeConfig.middleware)
			? routeConfig.middleware
			: [routeConfig.middleware]
		: [];
	const middleware = [...initGuard, ...initMiddleware];

	return createRoute({
		...routeConfig,
		middleware,
	});
};
