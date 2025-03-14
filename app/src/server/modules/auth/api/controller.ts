import { ENV } from "@/configs/env";
import {
	AUTH_TOKEN_COOKIE_NAME,
	AUTH_TOKEN_LIFETIME,
} from "@/server/core/middleware/auth";
import { log } from "@/server/core/middleware/logger";
import { honoWithHook } from "@/server/lib/hono";
import {
	errorResponse,
	successWithDataResponse,
} from "@/server/shared/schema/response";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { userRepository } from "../../users/infrastructure/repository";
import { authRouteConfigs } from "./routes";

const authRoutes = honoWithHook();

function isValidPagePath(path: string): boolean {
	const pathRegex = /^\/[a-zA-Z0-9\-_\/]*$/;
	return pathRegex.test(path);
}

authRoutes.openapi(authRouteConfigs.me, async (c) => {
	const user = c.get("user");
	if (!user) {
		return errorResponse(c, 401, "unauthorized", "error", undefined, {
			message: "not authenticated",
		});
	}
	return successWithDataResponse(c, user);
});

authRoutes.openapi(authRouteConfigs.logout, async (c) => {
	deleteCookie(c, AUTH_TOKEN_COOKIE_NAME);
	deleteCookie(c, "redirectUrl");
	deleteCookie(c, "state");
	return c.redirect("/");
});

authRoutes.openapi(authRouteConfigs.googleAuth, async (c) => {
	const providerUser = c.get("user-google");

	if (!providerUser) {
		return errorResponse(c, 401, "unauthorized", "error", undefined, {
			message: "invalid user",
		});
	}
	if (providerUser.verified_email === false) {
		return errorResponse(c, 401, "unauthorized", "error", undefined, {
			message: "email not verified",
		});
	}
	if (!providerUser.name) {
		return errorResponse(c, 401, "unauthorized", "error", undefined, {
			message: "name not found",
		});
	}

	if (providerUser.email && providerUser.id) {
		const foundUser = await userRepository.getByJwtSub(providerUser.id);

		if (foundUser) {
			const token = await sign({ userId: foundUser.id }, ENV.JWT_SECRET);

			c.set("user", foundUser);

			setCookie(c, AUTH_TOKEN_COOKIE_NAME, token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				expires: new Date(Date.now() + AUTH_TOKEN_LIFETIME * 1000),
			});
		} else {
			const newUser = await userRepository.create(
				providerUser.id as string,
				providerUser.name as string,
			);

			c.set("user", newUser);
			const token = await sign({ userId: newUser.id }, ENV.JWT_SECRET);
			setCookie(c, AUTH_TOKEN_COOKIE_NAME, token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				path: "/",
				expires: new Date(Date.now() + AUTH_TOKEN_LIFETIME * 1000),
			});
		}
	}

	const redirectUrl = await getCookie(c, "redirectUrl");

	log.info({
		prefix: "res",
		url: c.req.raw.url,
		status: c.res.status,
		user: c.get("user")?.id || "na",
	});

	if (redirectUrl && typeof redirectUrl === "string") {
		if (!isValidPagePath(redirectUrl)) {
			console.error("無効なリダイレクトURL", redirectUrl);
			return c.redirect("/dashboard");
		}

		deleteCookie(c, "redirectUrl");
		return c.redirect(redirectUrl);
	}

	return c.redirect("/dashboard");
});

export { authRoutes };
