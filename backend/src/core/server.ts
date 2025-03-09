import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { env } from "std-env";
import { ENV } from "~/configs/env";
import { docs } from "~/lib/doc";
import { honoWithHook } from "~/lib/hono";
import { gameRoutes } from "~/modules/games/api/controller";
import { errorResponse } from "~/shared/schema/response";
import { logger } from "./middleware/logger";

const isDevelopment = !env.isCI;

const app = honoWithHook();

docs(app);

app.use(contextStorage());

app.use("*", secureHeaders());

// CORS
const corsOptions: Parameters<typeof cors>[0] = {
	origin: `https://${ENV.DOMAIN_NAME}`,
	credentials: true,
	allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
	allowHeaders: [],
};
app.use("*", cors(corsOptions));

// CSRF
app.use("*", csrf({ origin: `https://${ENV.DOMAIN_NAME}` }));

// GET の場合は圧縮
!isDevelopment &&
	app.use("*", (c, next) => {
		if (c.req.method === "GET") {
			return compress()(c, next);
		}
		return next();
	});

// Body のサイズ制限
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

const routes = honoWithHook();

routes.get("/", (c) => c.text("Hello Hono!おめでとうございます！")); // 確認用
routes.get("/health", (c) => c.json({ status: "ok" }));

const nestedRoutes = honoWithHook();

nestedRoutes.route("/games", gameRoutes);
routes.route(`${ENV.API_VERSION}`, nestedRoutes);
// .route("/characters", characterRoutes)
// .route("/assets", assetRoutes)

app.route("/api", routes);

app.notFound((c) =>
	errorResponse(c, 404, "notFound", "warn", undefined, { path: c.req.path }),
);

app.onError((err, ctx) =>
	errorResponse(ctx, 500, "internalServerError", "error", undefined, {}, err),
);

export default app;
