import { OpenAPIHono } from "@hono/zod-openapi";
import { ZodError } from "zod";
import type { Env } from "~/lib/context";
import { errorResponse } from "../shared/schema/response";

export const honoWithHook = () =>
	new OpenAPIHono<Env>({
		defaultHook: (result, ctx) => {
			if (!result.success && result.error instanceof ZodError) {
				const message = result.error.issues[0].message;
				const type = result.error.issues[0].code;
				const path = result.error.issues[0].path[0];

				return errorResponse(ctx, 400, "badRequest", "warn", undefined, {
					message,
					type,
					path,
				});
			}
		},
	});
