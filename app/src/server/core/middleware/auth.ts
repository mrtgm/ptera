import { AUTH_TOKEN_COOKIE_NAME } from "@/configs/constants";
import { ENV } from "@/configs/env";
import type { Env } from "@/server/lib/context";
import { userRepository } from "@/server/modules/users/infrastructure/repository";
import { errorResponse } from "@/server/shared/schema/response";
import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export const isAuthenticated = createMiddleware<Env>(async (c, next) => {
	const signedCookie = await getCookie(c, AUTH_TOKEN_COOKIE_NAME);

	if (!signedCookie) {
		return errorResponse(c, 401, "unauthorized", "error");
	}

	const parsedToken = await verify(signedCookie, ENV.JWT_SECRET);
	const userId = parsedToken.userId as number | undefined;

	if (!userId) {
		return errorResponse(c, 401, "unauthorized", "error");
	}

	const user = await userRepository.getById(userId);

	if (!user) {
		return errorResponse(c, 401, "unauthorized", "error");
	}

	c.set("user", user);

	await next();
});

export async function isPublicAccess(_: Context, next: Next): Promise<void> {
	await next();
}
