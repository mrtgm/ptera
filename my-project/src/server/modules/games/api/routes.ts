import { isAuthenticated, isPublicAccess } from "@/server/core/middleware/auth";
import { createRouteConfig } from "@/server/lib/doc";
import { getRequestSchema } from "@/server/shared/schema/request";
import {
	errorResponses,
	successWithDataSchema,
	successWithPaginationSchema,
} from "@/server/shared/schema/response";
import {
	createGameDtoSchema,
	gameDetailResponseDtoSchema,
	gameListResponseDtoSchema,
	gameResponseDtoSchema,
	resourseResponseDtoSchema,
} from "../application/dto";
import { getGamesRequstSchema } from "./validator";

export const gameRouteCongfigs = {
	getGame: createRouteConfig({
		method: "get",
		path: "/{publicId}",
		guard: [isPublicAccess],
		tags: ["games"],
		summary: "ゲームを取得します。",
		request: {
			params: getRequestSchema,
		},
		responses: {
			200: {
				description: "Game",
				content: {
					"application/json": {
						schema: successWithDataSchema(gameDetailResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	getGames: createRouteConfig({
		method: "get",
		path: "/",
		guard: [isPublicAccess],
		tags: ["games"],
		summary: "ゲーム一覧を取得します。",
		request: {
			query: getGamesRequstSchema,
		},
		responses: {
			200: {
				description: "Games",
				content: {
					"application/json": {
						schema: successWithPaginationSchema(gameListResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	createGame: createRouteConfig({
		method: "post",
		path: "/",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "ゲームを作成します。",
		request: {
			body: {
				content: {
					"application/json": {
						schema: createGameDtoSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Game",
				content: {
					"application/json": {
						schema: successWithDataSchema(gameResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	getAsset: createRouteConfig({
		method: "get",
		path: "/{publicId}/assets",
		guard: [isPublicAccess],
		tags: ["games"],
		summary: "ゲームのアセットを取得します。",
		request: {
			params: getRequestSchema,
		},
		responses: {
			200: {
				description: "Game",
				content: {
					"application/json": {
						schema: successWithDataSchema(resourseResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),
};
