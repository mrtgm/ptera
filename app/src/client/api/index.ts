import { ENV } from "@/configs/env";
import { ApiError } from "./generated/core/ApiError";
import type { ApiRequestOptions } from "./generated/core/ApiRequestOptions";
import type { ApiResult } from "./generated/core/ApiResult";

import type {
	AssetCharacterLinkRequest,
	AssetResponse,
	CharacterResponse,
	CreateAssetRequest,
	CreateCharacterRequest,
	UpdateAssetRequest,
	UpdateCharacterRequest,
} from "@/schemas/assets/dto";
import {
	type CategoryResponse,
	type CommentResponse,
	type CreateCommentRequest,
	type CreateEventRequest,
	type CreateGameRequest,
	type CreateSceneRequest,
	type EventResponse,
	type GameDetailResponse,
	type GameListResponse,
	type GetCommentsRequest,
	type GetGamesRequest,
	type MoveEventRequest,
	type ResourceResponse,
	type SceneResponse,
	type UpdateEventRequest,
	type UpdateGameRequest,
	type UpdateGameStatusRequest,
	type UpdateSceneRequest,
	type UpdateSceneSettingRequest,
	createSceneRequestSchema,
} from "@/schemas/games/dto";
import type { UpdateProfileRequest, UserResponse } from "@/schemas/users/dto";

import { PteraApiClient } from "./generated";

export type ApiResponse<T = unknown> = {
	data?: T;
	error?: {
		status: number;
		message: string;
		details?: unknown;
	};
	success: boolean;
};

export const BASE_URL =
	process.env.NODE_ENV === "production"
		? `https://${ENV.NEXT_PUBLIC_DOMAIN_NAME}`
		: "http://localhost:3000";

export const apiClient = new PteraApiClient({
	BASE: BASE_URL,
	WITH_CREDENTIALS: true,
	CREDENTIALS: "include",
	HEADERS: {
		"Content-Type": "application/json",
	},
});

export const rethrowApiError = (error: unknown) => {
	if (error instanceof ApiError) {
		if (error.status >= 400 && error.status < 500) {
			// 4xx系エラーはレスポンスとして返す
			return {
				error,
				success: false,
			};
		}
		// 5xx系エラーは例外を再スロー
		if (error.status >= 500) {
			throw error;
		}
	}
	// ネットワーク系エラーの場合は例外を再スロー
	const unknownError = new Error(
		error instanceof Error ? error.message : "不明なエラーが発生しました",
	);
	throw unknownError;
};

// openapi-typescript-codegen が生成する型定義が不完全なため、戻り値にアサーションを当て直す
async function handleApiResponse<T>(
	apiCall: () => Promise<unknown>,
): Promise<ApiResponse<T>> {
	try {
		const data = await apiCall();
		return data as ApiResponse<T>;
	} catch (error) {
		return rethrowApiError(error);
	}
}

export const api = {
	client: apiClient,

	withToken: (token: string) => {
		api.client = new PteraApiClient({
			BASE: BASE_URL,
			WITH_CREDENTIALS: true,
			CREDENTIALS: "include",
			HEADERS: {
				"Content-Type": "application/json",
				Cookie: `ptera-auth=${token}`,
			},
		});
	},

	// 認証関連
	auth: {
		// ログアウト
		logout: async () => {
			const response = await handleApiResponse<boolean>(() =>
				api.client.auth.getApiV1AuthLogout(),
			);
			return response.success;
		},
		// ログインユーザー情報取得
		me: async () => {
			const response = await handleApiResponse<UserResponse>(() =>
				api.client.auth.getApiV1AuthMe(),
			);
			return response.data;
		},
		getMyGames: async () => {
			const response = await handleApiResponse<GameListResponse[]>(() =>
				api.client.dashboard.getApiV1MeGames(),
			);
			return response.data;
		},
		likedGames: async () => {
			const response = await handleApiResponse<number[]>(() =>
				api.client.dashboard.getApiV1MeLiked(),
			);
			return response.data;
		},
	},

	users: {
		get: async (userId: number) => {
			const response = await handleApiResponse<UserResponse>(() =>
				api.client.users.getApiV1Users(userId),
			);
			return response.data as UserResponse;
		},
		getGames: async (userId: number) => {
			const response = await handleApiResponse<GameDetailResponse[]>(() =>
				api.client.users.getApiV1UsersGames(userId),
			);
			return response.data as GameDetailResponse[];
		},
		updateProfile: async (userId: number, params: UpdateProfileRequest) => {
			const response = await handleApiResponse<UserResponse>(() =>
				api.client.users.putApiV1UsersProfile(userId, params),
			);
			return response.data as UserResponse;
		},
	},

	games: {
		getCategories: async () => {
			const response = await handleApiResponse<CategoryResponse[]>(() =>
				api.client.games.getApiV1GamesCategories(),
			);

			return response.data;
		},

		list: async (filter: GetGamesRequest) => {
			const response = await handleApiResponse<{
				items: GameListResponse[];
				total: number;
			}>(() =>
				api.client.games.getApiV1Games1(
					filter.q,
					filter.sort,
					filter.order,
					filter.offset,
					filter.limit,
					filter.categoryId,
				),
			);

			if (!response.success || !response.data) {
				return {
					items: [],
					total: 0,
				};
			}

			return {
				items: response.data.items as GameListResponse[],
				total: response.data.total,
			};
		},

		// ゲーム取得
		get: async (gameId: number) => {
			const response = await handleApiResponse<GameDetailResponse>(() =>
				api.client.games.getApiV1Games(gameId),
			);
			return response.data as GameDetailResponse;
		},

		// ゲーム作成
		create: async (params: CreateGameRequest) => {
			const response = await handleApiResponse<GameDetailResponse>(() =>
				api.client.games.postApiV1Games(params),
			);
			return response.data as GameDetailResponse;
		},

		// ゲームアセット取得
		getAssets: async (gameId: number) => {
			const response = await handleApiResponse<ResourceResponse>(() =>
				api.client.games.getApiV1GamesAssets(gameId),
			);
			return response.data as ResourceResponse;
		},

		// ゲーム更新
		update: async (gameId: number, params: UpdateGameRequest) => {
			const response = await handleApiResponse<GameDetailResponse>(() =>
				api.client.games.putApiV1Games(gameId, params),
			);
			return response.data as GameDetailResponse;
		},

		// ゲームステータス更新
		updateStatus: async (gameId: number, params: UpdateGameStatusRequest) => {
			const response = await handleApiResponse<GameDetailResponse>(() =>
				api.client.games.putApiV1GamesStatus(gameId, params),
			);
			return response.data;
		},

		// ゲーム削除
		delete: async (gameId: number) => {
			const response = await handleApiResponse<boolean>(() =>
				api.client.games.deleteApiV1Games(gameId),
			);
			return response.success;
		},

		// プレイ回数増加
		incrementPlayCount: async (gameId: number) => {
			const response = await handleApiResponse<{
				count: number;
			}>(() => api.client.games.postApiV1GamesPlay(gameId));
			return response.data;
		},

		// いいね追加
		like: async (gameId: number) => {
			const response = await handleApiResponse<{
				count: number;
			}>(() => api.client.games.postApiV1GamesLikes(gameId));
			return response.data;
		},

		// いいね取り消し
		unlike: async (gameId: number) => {
			const response = await handleApiResponse<{
				count: number;
			}>(() => api.client.games.deleteApiV1GamesLikes(gameId));
			return response.data;
		},

		getComments: async (gameId: number) => {
			const response = await handleApiResponse<CommentResponse[]>(() =>
				api.client.games.getApiV1GamesComments(gameId),
			);
			return response.data;
		},

		// コメント投稿
		createComment: async (gameId: number, data: CreateCommentRequest) => {
			const response = await handleApiResponse<CommentResponse>(() =>
				api.client.games.postApiV1GamesComments(gameId, data),
			);
			return response.data;
		},

		// コメント削除
		deleteComment: async (gameId: number, commentId: number) => {
			const response = await handleApiResponse<boolean>(() =>
				api.client.games.deleteApiV1GamesComments(gameId, commentId),
			);
			return response.success;
		},

		// シーン関連
		scenes: {
			// シーン取得
			get: async (gameId: number, sceneId: number) => {
				const response = await handleApiResponse<SceneResponse>(() =>
					api.client.games.getApiV1GamesScenes(gameId, sceneId),
				);
				return response.data;
			},

			// シーン作成
			create: async (gameId: number, params: CreateSceneRequest) => {
				createSceneRequestSchema.parse(params);
				console.log(params);
				const response = await handleApiResponse<SceneResponse>(() =>
					api.client.games.postApiV1GamesScenes(gameId, {
						name: params.name,
						fromScene: {
							id: params.fromScene.id,
							sceneType: params.fromScene.sceneType,
							choices: params.fromScene.choices,
							nextSceneId: params.fromScene.nextSceneId,
						},
						choiceId: params.choiceId,
					}),
				);
				return response.data;
			},

			// シーン更新
			update: async (
				gameId: number,
				sceneId: number,
				params: UpdateSceneRequest,
			) => {
				const response = await handleApiResponse<SceneResponse>(() =>
					api.client.games.putApiV1GamesScenes(gameId, sceneId, params),
				);
				return response.data;
			},

			updateSetting: async (
				gameId: number,
				sceneId: number,
				params: UpdateSceneSettingRequest,
			) => {
				const response = await handleApiResponse<SceneResponse>(() =>
					api.client.games.putApiV1GamesScenesSetting(gameId, sceneId, params),
				);
				return response.data;
			},

			// シーン削除
			delete: async (gameId: number, sceneId: number) => {
				const response = await handleApiResponse<boolean>(() =>
					api.client.games.deleteApiV1GamesScenes(gameId, sceneId),
				);
				return response.success;
			},

			// イベント関連
			events: {
				// イベント作成
				create: async (
					gameId: number,
					sceneId: number,
					data: CreateEventRequest,
				) => {
					const response = await handleApiResponse<EventResponse>(() =>
						api.client.games.postApiV1GamesScenesEvents(gameId, sceneId, data),
					);
					return response.data;
				},

				// イベント順序変更
				move: async (
					gameId: number,
					sceneId: number,
					params: MoveEventRequest,
				) => {
					const response = await handleApiResponse<boolean>(() =>
						api.client.games.putApiV1GamesScenesEventsMove(
							gameId,
							sceneId,
							params,
						),
					);
					return response.success;
				},

				// イベント更新
				update: async (
					gameId: number,
					sceneId: number,
					eventId: number,
					params: UpdateEventRequest,
				) => {
					const response = await handleApiResponse<EventResponse>(() =>
						api.client.games.putApiV1GamesScenesEvents(
							gameId,
							sceneId,
							eventId,
							params,
						),
					);
					return response.data;
				},

				// イベント削除
				delete: async (gameId: number, sceneId: number, eventId: number) => {
					const response = await handleApiResponse<boolean>(() =>
						api.client.games.deleteApiV1GamesScenesEvents(
							gameId,
							sceneId,
							eventId,
						),
					);
					return response.success;
				},
			},
		},
	},

	// アセット関連
	assets: {
		upload: async (params: CreateAssetRequest) => {
			const response = await handleApiResponse<AssetResponse>(() =>
				api.client.assets.postApiV1Assets({
					file: params.file,
					assetType: params.assetType,
					name: params.name,
					metadata: JSON.stringify(params.metadata),
				}),
			);
			return response.data;
		},

		// アセット更新
		update: async (assetId: number, data: UpdateAssetRequest) => {
			const response = await handleApiResponse<AssetResponse>(() =>
				api.client.assets.putApiV1Assets(assetId, data),
			);
			return response.data;
		},

		// アセット削除
		delete: async (assetId: number) => {
			const response = await handleApiResponse<boolean>(() =>
				api.client.assets.deleteApiV1Assets(assetId),
			);
			return response.success;
		},

		unlinkGame: async (assetId: number, gameId: number) => {
			const response = await handleApiResponse<boolean>(() =>
				api.client.assets.deleteApiV1AssetsGames(assetId, gameId),
			);
			return response.success;
		},
	},

	// キャラクター関連
	characters: {
		// キャラクター作成
		create: async (params: CreateCharacterRequest) => {
			const response = await handleApiResponse<CharacterResponse>(() =>
				api.client.characters.postApiV1Characters(params),
			);
			return response.data;
		},

		// キャラクター更新
		update: async (characterId: number, data: UpdateCharacterRequest) => {
			const response = await handleApiResponse<CharacterResponse>(() =>
				api.client.characters.putApiV1Characters(characterId, data),
			);
			return response.data;
		},

		// キャラクター削除
		delete: async (characterId: number) => {
			const response = await handleApiResponse<boolean>(() =>
				api.client.characters.deleteApiV1Characters(characterId),
			);
			return response.success;
		},

		linkAsset: async (characterId: number, data: AssetCharacterLinkRequest) => {
			const response = await handleApiResponse<boolean>(() =>
				api.client.characters.postApiV1CharactersAssets(characterId, data),
			);
			return response.success;
		},

		unlinkAsset: async (characterId: number, assetId: number) => {
			const response = await handleApiResponse<boolean>(() =>
				api.client.characters.deleteApiV1CharactersAssets(characterId, assetId),
			);
			return response.success;
		},
	},
};
