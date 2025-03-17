import { ENV } from "@ptera/config";
import { bodyLimit } from "hono/body-limit";
import { compress } from "hono/compress";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { env } from "std-env";
import { docs } from "../lib/doc";
import { honoWithHook } from "../lib/hono";
import { assetRoutes, characterRoutes } from "../modules/assets/api/controller";
import { authRoutes } from "../modules/auth/api/controller";
import { gameRoutes } from "../modules/games/api/controller";
import { dashboardRoutes } from "../modules/me/api/controller";
import { userRoutes } from "../modules/users/api/controller";
import { errorResponse } from "../shared/schema/response";
import { logger } from "./middleware/logger";

const isDevelopment = !env.isCI;

const app = honoWithHook();

docs(app);

app.use(contextStorage());

app.use("*", secureHeaders());

const corsOptions: Parameters<typeof cors>[0] = {
  origin: isDevelopment ? "*" : `https://${ENV.NEXT_PUBLIC_DOMAIN_NAME}`,
  credentials: true,
  allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
  allowHeaders: [],
};
app.use("*", cors(corsOptions));

app.use("*", async (c, next) => {
  try {
    if (isDevelopment) {
      await next();
    } else {
      await csrf({ origin: `https://${ENV.NEXT_PUBLIC_DOMAIN_NAME}` })(c, next);
    }
  } catch (error) {
    console.error("[CSRF-ERROR]", error);
    throw error;
  }
});

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

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

const nestedRoutes = honoWithHook()
  .route("/games", gameRoutes)
  .route("/auth", authRoutes)
  .route("/users", userRoutes)
  .route("/characters", characterRoutes)
  .route("/me", dashboardRoutes)
  .route("/assets", assetRoutes);

app.route(`/api/${ENV.NEXT_PUBLIC_API_VERSION}`, nestedRoutes);

app.notFound((c) =>
  errorResponse(c, 404, "notFound", "warn", undefined, { path: c.req.path }),
);

app.onError((err, ctx) => {
  return errorResponse(ctx, 500, "internalServerError", "error", undefined, {
    err,
  });
});

export { nestedRoutes };
export type AppType = typeof nestedRoutes;

export default app;
