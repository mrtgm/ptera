import { ENV } from "@/configs/env";
import { isPublicAccess } from "@/server/core/middleware/auth";
import { createRouteConfig } from "@/server/lib/doc";
import {
	errorResponses,
	successWithDataSchema,
} from "@/server/shared/schema/response";
import { googleAuth } from "@hono/oauth-providers/google";
import { userResponseSchema } from "../../../../schemas/users/dto";

export const authRouteConfigs = {
	logout: createRouteConfig({
		method: "get",
		path: "/logout",
		guard: [isPublicAccess],
		tags: ["auth"],
		summary: "ログアウトします。",
		responses: {
			302: {
				description: "Redirect to top page",
			},
			...errorResponses,
		},
	}),

	googleAuth: createRouteConfig({
		method: "get",
		path: "/google",
		guard: [
			googleAuth({
				client_id: ENV.GOOGLE_CLIENT_ID,
				client_secret: ENV.GOOGLE_CLIENT_SECRET,
				scope: ["openid", "email", "profile"],
			}),
		],
		tags: ["auth"],
		summary: "Googleアカウントでログインします。",
		responses: {
			302: {
				description: "Redirect to original URL or top page on success",
			},
			...errorResponses,
		},
	}),

	me: createRouteConfig({
		method: "get",
		path: "/me",
		guard: [isPublicAccess],
		tags: ["auth"],
		summary: "ログインユーザー情報を取得します。",
		responses: {
			200: {
				description: "User information",
				content: {
					"application/json": {
						schema: successWithDataSchema(userResponseSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	// refreshToken: createRouteConfig({
	// 	method: "post",
	// 	path: "/refresh",
	// 	guard: [isPublicAccess],
	// 	tags: ["auth"],
	// 	summary: "認証トークンをリフレッシュします。",
	// 	request: {
	// 		body: {
	// 			content: {
	// 				"application/json": {
	// 					schema: z.object({
	// 						refreshToken: z.string(),
	// 					}),
	// 				},
	// 			},
	// 		},
	// 	},
	// 	responses: {
	// 		200: {
	// 			description: "Refreshed token",
	// 			content: {
	// 				"application/json": {
	// 					schema: successWithDataSchema(authTokenResponseSchema),
	// 				},
	// 			},
	// 		},
	// 		...errorResponses,
	// 	},
	// }),
};
