import { isAuthenticated, isPublicAccess } from "@/server/core/middleware/auth";
import { createRouteConfig } from "@/server/lib/doc";
import {
	errorResponses,
	successWithDataSchema,
} from "@/server/shared/schema/response";
import {
	updateProfileRequestSchema,
	userResponseSchema,
} from "../application/dto";
import { userParamsSchema } from "./validator";

export const userRouteConfigs = {
	getUser: createRouteConfig({
		method: "get",
		path: "/{userId}",
		guard: [isPublicAccess],
		tags: ["users"],
		summary: "ユーザー情報を取得します。",
		request: {
			params: userParamsSchema,
		},
		responses: {
			200: {
				description: "User",
				content: {
					"application/json": {
						schema: successWithDataSchema(userResponseSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	updateUserProfile: createRouteConfig({
		method: "put",
		path: "/{userId}/profile",
		guard: [isAuthenticated],
		tags: ["users"],
		summary: "ユーザーのプロフィール情報を更新します。",
		request: {
			params: userParamsSchema,
			body: {
				content: {
					"application/json": {
						schema: updateProfileRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Updated User Profile",
				content: {
					"application/json": {
						schema: successWithDataSchema(userResponseSchema),
					},
				},
			},
			...errorResponses,
		},
	}),
};
