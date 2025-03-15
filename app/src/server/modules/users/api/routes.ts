import {
	gameListResponseSchema,
	gameResponseSchema,
} from "@/schemas/games/dto";
import { isAuthenticated, isPublicAccess } from "@/server/core/middleware/auth";
import { createRouteConfig } from "@/server/lib/doc";
import {
	errorResponses,
	successWithDataSchema,
} from "@/server/shared/schema/response";
import {
	updateProfileRequestSchema,
	userResponseSchema,
} from "../../../../schemas/users/dto";
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

	getUserGames: createRouteConfig({
		method: "get",
		path: "/{userId}/games",
		guard: [isPublicAccess],
		tags: ["users"],
		summary: "ユーザーが作成したゲーム一覧を取得します。",
		request: {
			params: userParamsSchema,
		},
		responses: {
			200: {
				description: "User Games",
				content: {
					"application/json": {
						schema: successWithDataSchema(gameListResponseSchema.array()),
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
