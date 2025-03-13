import { isAuthenticated, isPublicAccess } from "@/server/core/middleware/auth";
import { createRouteConfig } from "@/server/lib/doc";
import {
	errorResponses,
	successWithDataSchema,
	successWithPaginationSchema,
	successWithoutDataSchema,
} from "@/server/shared/schema/response";
import {
	commentResponseDtoSchema,
	countResponseDtoSchema,
	createCommentRequestSchema,
	createEventRequestSchema,
	createGameDtoSchema,
	createSceneRequestSchema,
	eventResponseDtoSchema,
	gameDetailResponseDtoSchema,
	gameListResponseDtoSchema,
	gameResponseDtoSchema,
	getCommentsRequestSchema,
	getGamesRequstSchema,
	moveEventRequestSchema,
	resourseResponseDtoSchema,
	sceneResponseDtoSchema,
	updateEventRequestSchema,
	updateGameDtoSchema,
	updateGameStatusDtoSchema,
	updateSceneRequestSchema,
} from "../application/dto";
import {
	commentParamSchema,
	eventParamSchema,
	gameParamSchema,
	sceneParamSchema,
} from "./validator";

export const gameRouteCongfigs = {
	getGame: createRouteConfig({
		method: "get",
		path: "/{gameId}",
		guard: [isPublicAccess],
		tags: ["games"],
		summary: "ゲームを取得します。",
		request: {
			params: gameParamSchema,
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
		path: "/{gameId}/assets",
		guard: [isPublicAccess],
		tags: ["games"],
		summary: "ゲームのアセットを取得します。",
		request: {
			params: gameParamSchema,
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

	updateGame: createRouteConfig({
		method: "put",
		path: "/{gameId}",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "ゲームを更新します。",
		request: {
			params: gameParamSchema,
			body: {
				content: {
					"application/json": {
						schema: updateGameDtoSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Updated Game",
				content: {
					"application/json": {
						schema: successWithDataSchema(gameResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	updateGameStatus: createRouteConfig({
		method: "put",
		path: "/{gameId}/status",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "ゲームのステータスを更新します。",
		request: {
			params: gameParamSchema,
			body: {
				content: {
					"application/json": {
						schema: updateGameStatusDtoSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Updated Game",
				content: {
					"application/json": {
						schema: successWithDataSchema(gameResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	deleteGame: createRouteConfig({
		method: "delete",
		path: "/{gameId}",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "ゲームを削除します。",
		request: {
			params: gameParamSchema,
			body: {
				content: {
					"application/json": {
						schema: {},
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithoutDataSchema,
					},
				},
			},
			...errorResponses,
		},
	}),

	playGame: createRouteConfig({
		method: "post",
		path: "/{gameId}/play",
		guard: [isPublicAccess],
		tags: ["games"],
		summary: "ゲームのプレイ回数を増やします。",
		request: {
			params: gameParamSchema,
			body: {
				content: {
					"application/json": {
						schema: {},
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithDataSchema(countResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	likeGame: createRouteConfig({
		method: "post",
		path: "/{gameId}/likes",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "ゲームにいいねを追加します。",
		request: {
			params: gameParamSchema,
			body: {
				content: {
					"application/json": {
						schema: {},
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithDataSchema(countResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	unlikeGame: createRouteConfig({
		method: "delete",
		path: "/{gameId}/likes",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "ゲームのいいねを取り消します。",
		request: {
			params: gameParamSchema,
			body: {
				content: {
					"application/json": {
						schema: {},
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithDataSchema(countResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	getComments: createRouteConfig({
		method: "get",
		path: "/{gameId}/comments",
		guard: [isPublicAccess],
		tags: ["games"],
		summary: "ゲームのコメント一覧を取得します。",
		request: {
			params: gameParamSchema,
			query: getCommentsRequestSchema,
		},
		responses: {
			200: {
				description: "Comments",
				content: {
					"application/json": {
						schema: successWithPaginationSchema(commentResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	createComment: createRouteConfig({
		method: "post",
		path: "/{gameId}/comments",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "ゲームにコメントを投稿します。",
		request: {
			params: gameParamSchema,
			body: {
				content: {
					"application/json": {
						schema: createCommentRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Created Comment",
				content: {
					"application/json": {
						schema: successWithDataSchema(commentResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	deleteComment: createRouteConfig({
		method: "delete",
		path: "/{gameId}/comments/{commentId}",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "コメントを削除します。",
		request: {
			params: commentParamSchema,
			body: {
				content: {
					"application/json": {
						schema: {},
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithoutDataSchema,
					},
				},
			},
			...errorResponses,
		},
	}),

	createScene: createRouteConfig({
		method: "post",
		path: "/{gameId}/scenes",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "シーンを作成します。",
		request: {
			params: gameParamSchema,
			body: {
				content: {
					"application/json": {
						schema: createSceneRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Created Scene",
				content: {
					"application/json": {
						schema: successWithDataSchema(sceneResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	updateScene: createRouteConfig({
		method: "put",
		path: "/{gameId}/scenes/{sceneId}",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "シーンを更新します。",
		request: {
			params: sceneParamSchema,
			body: {
				content: {
					"application/json": {
						schema: updateSceneRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Updated Scene",
				content: {
					"application/json": {
						schema: successWithDataSchema(sceneResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	deleteScene: createRouteConfig({
		method: "delete",
		path: "/{gameId}/scenes/{sceneId}",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "シーンを削除します。",
		request: {
			params: sceneParamSchema,
			body: {
				content: {
					"application/json": {
						schema: {},
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithoutDataSchema,
					},
				},
			},
			...errorResponses,
		},
	}),

	createEvent: createRouteConfig({
		method: "post",
		path: "/{gameId}/scenes/{sceneId}/events",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "イベントを作成します。",
		request: {
			params: sceneParamSchema,
			body: {
				content: {
					"application/json": {
						schema: createEventRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Created Event",
				content: {
					"application/json": {
						schema: successWithDataSchema(eventResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	moveEvent: createRouteConfig({
		method: "put",
		path: "/{gameId}/scenes/{sceneId}/events/move",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "イベントの順序を変更します。",
		request: {
			params: sceneParamSchema,
			body: {
				content: {
					"application/json": {
						schema: moveEventRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithoutDataSchema,
					},
				},
			},
			...errorResponses,
		},
	}),

	updateEvent: createRouteConfig({
		method: "put",
		path: "/{gameId}/scenes/{sceneId}/events/{eventId}",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "イベントを更新します。",
		request: {
			params: eventParamSchema,
			body: {
				content: {
					"application/json": {
						schema: updateEventRequestSchema,
					},
				},
			},
		},
		responses: {
			200: {
				description: "Updated Event",
				content: {
					"application/json": {
						schema: successWithDataSchema(eventResponseDtoSchema),
					},
				},
			},
			...errorResponses,
		},
	}),

	deleteEvent: createRouteConfig({
		method: "delete",
		path: "/{gameId}/scenes/{sceneId}/events/{eventId}",
		guard: [isAuthenticated],
		tags: ["games"],
		summary: "イベントを削除します。",
		request: {
			params: eventParamSchema,
			body: {
				content: {
					"application/json": {
						schema: {},
					},
				},
			},
		},
		responses: {
			200: {
				description: "Success",
				content: {
					"application/json": {
						schema: successWithoutDataSchema,
					},
				},
			},
			...errorResponses,
		},
	}),
};
