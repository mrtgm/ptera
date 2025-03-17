import { swaggerUI } from "@hono/swagger-ui";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { ENV } from "@ptera/config";
import type { MiddlewareHandler } from "hono";
import type { Env } from "./context";

const commonModulesList = [
	{
		name: "auth",
		description: "認証関連のAPI",
	},
	{ name: "games", description: "ゲーム関連のAPI" },
	{ name: "users", description: "ユーザー管理のAPI" },
	{ name: "characters", description: "キャラクターのAPI" },
	{ name: "assets", description: "アセット管理のAPI" },
	{
		name: "dashboard",
		description: "ダッシュボード/ユーザープロフィールのAPI",
	},
];

export const docs = (app: OpenAPIHono<Env>) => {
	const registry = app.openAPIRegistry;

	registry.registerComponent("securitySchemes", "cookieAuth", {
		type: "apiKey",
		in: "cookie",
		name: "auth-token",
	});

	// OpenAPI
	app.doc31("/api/openapi.json", {
		servers: [{ url: "/" }],
		info: {
			title: "Ptera API",
			version: ENV.NEXT_PUBLIC_API_VERSION,
			description: "PteraのAPIドキュメント",
		},
		openapi: "3.1.0",
		tags: commonModulesList,
		security: [{ cookieAuth: [] }],
	});

	// Swagger UI
	app.get(
		"/api/docs",
		swaggerUI({
			url: "/api/openapi.json",
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
