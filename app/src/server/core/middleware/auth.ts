import { ENV } from "@/configs/env";
import type { Env } from "@/server/lib/context";
import { userRepository } from "@/server/modules/users/infrastructure/repository";
import { errorResponse } from "@/server/shared/schema/response";
import type { Context, Next } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { log } from "./logger";

export const AUTH_TOKEN_COOKIE_NAME = "auth-token";
export const AUTH_TOKEN_LIFETIME = 60 * 60 * 24 * 7; // 1週間

const getRedirectUrl = (url: string | null): string => {
	if (!url) return "";
	try {
		return new URL(url).pathname;
	} catch (error) {
		log.error({
			prefix: "url",
			message: "無効な URL",
			error: error,
		});
		return "";
	}
};

export const isAuthenticated = createMiddleware<Env>(async (c, next) => {
	const signedCookie = await getCookie(c, AUTH_TOKEN_COOKIE_NAME);

	const redirectUrl = getRedirectUrl(c.req.raw.headers.get("referer"));

	if (!signedCookie) {
		if (redirectUrl)
			setCookie(c, "redirectUrl", redirectUrl, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			});
		return errorResponse(c, 401, "unauthorized", "error");
	}

	const parsedToken = await verify(signedCookie, ENV.JWT_SECRET);
	const userId = parsedToken.userId as number | undefined;

	if (!userId) {
		if (redirectUrl)
			setCookie(c, "redirectUrl", redirectUrl, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			});
		return errorResponse(c, 401, "unauthorized", "error");
	}

	const user = await userRepository.getById(userId);

	if (!user) {
		setCookie(c, "redirectUrl", redirectUrl, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		});
		return errorResponse(c, 401, "unauthorized", "error");
	}

	c.set("user", user);
	await next();
});

export async function isPublicAccess(_: Context, next: Next): Promise<void> {
	await next();
}
