import { isAuthenticated, isPublicAccess } from "@/server/core/middleware/auth";
import { createRouteConfig } from "@/server/lib/doc";
import {
  errorResponses,
  successWithDataSchema,
  successWithPaginationSchema,
  successWithoutDataSchema,
} from "@/server/shared/schema/response";
import {
  categoryResponseSchema,
  commentResponseSchema,
  countResponseSchema,
  createCommentRequestSchema,
  createEventRequestSchema,
  createGameRequestSchema,
  createSceneRequestSchema,
  eventResponseSchema,
  gameDetailResponseSchema,
  gameListResponseSchema,
  gameMetaDataResponseSchema,
  gameResponseSchema,
  getCommentsRequestSchema,
  getGamesRequestSchema,
  moveEventRequestSchema,
  resourceResponseSchema,
  sceneResponseSchema,
  updateEventRequestSchema,
  updateGameRequestSchema,
  updateGameStatusRequestSchema,
  updateSceneRequestSchema,
  updateSceneSettingRequestSchema,
} from "@ptera/schema";
import {
  commentParamSchema,
  eventParamSchema,
  gameParamSchema,
  sceneParamSchema,
} from "./validator";

export const gameRouteCongfigs = {
  getCategories: createRouteConfig({
    method: "get",
    path: "/categories",
    guard: [isPublicAccess],
    tags: ["games"],
    summary: "ゲームカテゴリ一覧を取得します。",
    responses: {
      200: {
        description: "Categories",
        content: {
          "application/json": {
            schema: successWithDataSchema(categoryResponseSchema.array()),
          },
        },
      },
      ...errorResponses,
    },
  }),

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
            schema: successWithDataSchema(gameDetailResponseSchema),
          },
        },
      },
      ...errorResponses,
    },
  }),

  getGameMetadata: createRouteConfig({
    method: "get",
    path: "/{gameId}/metadata",
    guard: [isPublicAccess],
    tags: ["games"],
    summary: "ゲームメタデータを取得します。",
    request: {
      params: gameParamSchema,
    },
    responses: {
      200: {
        description: "Game Metadata",
        content: {
          "application/json": {
            schema: successWithDataSchema(gameMetaDataResponseSchema),
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
      query: getGamesRequestSchema,
    },
    responses: {
      200: {
        description: "Games",
        content: {
          "application/json": {
            schema: successWithPaginationSchema(gameListResponseSchema),
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
            schema: createGameRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Game",
        content: {
          "application/json": {
            schema: successWithDataSchema(gameDetailResponseSchema),
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
            schema: successWithDataSchema(resourceResponseSchema),
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
            schema: updateGameRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Updated Game",
        content: {
          "application/json": {
            schema: successWithDataSchema(gameResponseSchema),
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
            schema: updateGameStatusRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Updated Game",
        content: {
          "application/json": {
            schema: successWithDataSchema(gameResponseSchema),
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
    },
    responses: {
      200: {
        description: "Success",
        content: {
          "application/json": {
            schema: successWithDataSchema(countResponseSchema),
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
            schema: successWithDataSchema(countResponseSchema),
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
            schema: successWithDataSchema(countResponseSchema),
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
    },
    responses: {
      200: {
        description: "Comments",
        content: {
          "application/json": {
            schema: successWithDataSchema(commentResponseSchema.array()),
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
            schema: successWithDataSchema(commentResponseSchema),
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

  getScene: createRouteConfig({
    method: "get",
    path: "/{gameId}/scenes/{sceneId}",
    guard: [isPublicAccess],
    tags: ["games"],
    summary: "シーンを取得します。",
    request: {
      params: sceneParamSchema,
    },
    responses: {
      200: {
        description: "Scene",
        content: {
          "application/json": {
            schema: successWithDataSchema(sceneResponseSchema),
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
            schema: successWithDataSchema(sceneResponseSchema),
          },
        },
      },
      ...errorResponses,
    },
  }),

  updateSceneSetting: createRouteConfig({
    method: "put",
    path: "/{gameId}/scenes/{sceneId}/setting",
    guard: [isAuthenticated],
    tags: ["games"],
    summary: "シーンの設定を更新します。",
    request: {
      params: sceneParamSchema,
      body: {
        content: {
          "application/json": {
            schema: updateSceneSettingRequestSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Updated Scene",
        content: {
          "application/json": {
            schema: successWithDataSchema(sceneResponseSchema),
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
            schema: successWithDataSchema(sceneResponseSchema),
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
            schema: successWithDataSchema(eventResponseSchema),
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
            schema: successWithDataSchema(eventResponseSchema),
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
