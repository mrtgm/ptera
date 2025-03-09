import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { Context, Next } from "hono";
import { ENV } from "~/configs/env";
import { userRepository } from "~/modules/users/infrastructure/repository";
import { errorResponse } from "~/shared/schema/response";

export const isAuthenticated = async (c: Context, next: Next) => {
	try {
		const token = c.req.header("authorization");

		const verifier = CognitoJwtVerifier.create({
			userPoolId: ENV.AWS_COGNITO_USER_POOL_ID,
			clientId: ENV.AWS_COGNITO_CLIENT_ID,
			tokenUse: "access",
		});

		if (!token) {
			return c.json(
				{
					message: "Authorization header missing",
				},
				401,
			);
		}

		const payload = await verifier.verify(token);

		const user = await userRepository.getByJwtSub(payload.sub);

		if (!user) {
			return errorResponse(c, 401, "userNotFound", "warn");
		}

		c.set("user", user);

		await next();
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return errorResponse(c, 401, "tokenNotValid", "warn", undefined, {
			error: errorMessage,
		});
	}
};

export async function isPublicAccess(_: Context, next: Next): Promise<void> {
	await next();
}
