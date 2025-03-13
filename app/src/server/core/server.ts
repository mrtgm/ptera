import { ENV } from "@/configs/env";
import { docs } from "@/server/lib/doc";
import { honoWithHook } from "@/server/lib/hono";
import { gameRoutes } from "@/server/modules/games/api/controller";
import { errorResponse } from "@/server/shared/schema/response";
import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { env } from "std-env";
import { assetRoutes, characterRoutes } from "../modules/assets/api/controller";
import { authRoutes } from "../modules/auth/api/controller";
import { dashboardRoutes } from "../modules/me/api/controller";
import { userRoutes } from "../modules/users/api/controller";
import { logger } from "./middleware/logger";

const isDevelopment = !env.isCI;

const app = honoWithHook();

docs(app);

app.use(contextStorage());

app.use("*", secureHeaders());

const corsOptions: Parameters<typeof cors>[0] = {
	origin: isDevelopment ? "*" : `https://${ENV.DOMAIN_NAME}`,
	credentials: true,
	allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
	allowHeaders: [],
};
app.use("*", cors(corsOptions));

app.use("*", csrf({ origin: `https://${ENV.DOMAIN_NAME}` }));

// GET の場合は圧縮
if (!isDevelopment) {
	app.use("*", (c, next) => {
		if (c.req.method === "GET") {
			return compress()(c, next);
		}
		return next();
	});
}

app.use(
	"*",
	bodyLimit({
		maxSize: 1 * 1024 * 1024, // 1mb
		onError: (ctx) => {
			return errorResponse(ctx, 413, "payloadTooLarge", "warn", undefined, {
				path: ctx.req.path,
			});
		},
	}),
);

app.use("*", logger());

app.get("/api", (c) => c.text("Hello Hono!おめでとうございます！"));
app.get("/api/health", (c) => {
	console.log(c.get("token"));

	return c.json({ status: "ok" });
});

const nestedRoutes = honoWithHook()
	.route("/games", gameRoutes)
	.route("/auth", authRoutes)
	.route("/users", userRoutes)
	.route("/characters", characterRoutes)
	.route("/me", dashboardRoutes)
	.route("/assets", assetRoutes);

app.route(`/api/${ENV.API_VERSION}`, nestedRoutes);

app.notFound((c) =>
	errorResponse(c, 404, "notFound", "warn", undefined, { path: c.req.path }),
);

app.onError((err, ctx) =>
	errorResponse(ctx, 500, "internalServerError", "error", undefined, {}, err),
);

export { nestedRoutes };
export type AppType = typeof nestedRoutes;

export default app;
