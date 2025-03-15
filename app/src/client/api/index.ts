import { ENV } from "@/configs/env";

import type {
	AssetCharacterLinkRequest,
	AssetResponse,
	CharacterResponse,
	CreateAssetRequest,
	CreateCharacterRequest,
	UpdateAssetRequest,
	UpdateCharacterRequest,
} from "@/schemas/assets/dto";
import type {
	CategoryResponse,
	CommentResponse,
	CreateCommentRequest,
	CreateEventRequest,
	CreateGameRequest,
	CreateSceneRequest,
	EventResponse,
	GameDetailResponse,
	GameListResponse,
	GetCommentsRequest,
	GetGamesRequest,
	MoveEventRequest,
	ResourceResponse,
	SceneResponse,
	UpdateEventRequest,
	UpdateGameRequest,
	UpdateGameStatusRequest,
	UpdateSceneRequest,
} from "@/schemas/games/dto";
import type { UpdateProfileRequest, UserResponse } from "@/schemas/users/dto";

import { PteraApiClient } from "./generated";

const BASE_URL =
	process.env.NODE_ENV === "production"
		? `https://${ENV.DOMAIN_NAME}/`
		: "http://localhost:3000/";

const apiClient = new PteraApiClient({
	BASE: BASE_URL,
	WITH_CREDENTIALS: true,
	CREDENTIALS: "include",
	HEADERS: {
		"Content-Type": "application/json",
	},
});

export const api = {
	// 認証関連
	auth: {
		// ログアウト
		logout: async () => {
			await apiClient.auth.getApiV1AuthLogout();
			return true;
		},
		// ログインユーザー情報取得
		me: async () => {
			const { data } = await apiClient.auth.getApiV1AuthMe();
			return data as UserResponse;
		},
		likedGames: async () => {
			const { data } = await apiClient.dashboard.getApiV1MeLiked();
			return data;
		},
	},

	users: {
		get: async (userId: number) => {
			const { data } = await apiClient.users.getApiV1Users(userId);
			return data as UserResponse;
		},

		getGames: async (userId: number) => {
			const { data } = await apiClient.users.getApiV1UsersGames(userId);
			return data as GameDetailResponse[];
		},
		updateProfile: async (userId: number, params: UpdateProfileRequest) => {
			const { data } = await apiClient.users.putApiV1UsersProfile(
				userId,
				params,
			);
			return data as UserResponse;
		},
	},

	games: {
		getCategories: async () => {
			const { data } = await apiClient.games.getApiV1GamesCategories();
			return data as CategoryResponse[];
		},

		list: async (filter: GetGamesRequest) => {
			const { data } = await apiClient.games.getApiV1Games1(
				filter.q,
				filter.sort,
				filter.order,
				filter.offset,
				filter.limit,
				filter.categoryId,
			);
			return {
				items: data.items as GameListResponse[],
				total: data.total,
			};
		},

		// ゲーム取得
		get: async (gameId: number) => {
			const { data } = await apiClient.games.getApiV1Games(gameId);
			return data as GameDetailResponse;
		},

		// ゲーム作成
		create: async (params: CreateGameRequest) => {
			const { data } = await apiClient.games.postApiV1Games(params);
			return data as GameDetailResponse;
		},

		// ゲームアセット取得
		getAssets: async (gameId: number) => {
			const { data } = await apiClient.games.getApiV1GamesAssets(gameId);
			return data as ResourceResponse;
		},

		// ゲーム更新
		update: async (gameId: number, params: UpdateGameRequest) => {
			const { data } = await apiClient.games.putApiV1Games(gameId, params);
			return data as GameDetailResponse;
		},

		// ゲームステータス更新
		updateStatus: async (gameId: number, params: UpdateGameStatusRequest) => {
			const { data } = await apiClient.games.putApiV1GamesStatus(
				gameId,
				params,
			);
			return data as GameDetailResponse;
		},

		// ゲーム削除
		delete: async (gameId: number) => {
			const { success } = await apiClient.games.deleteApiV1Games(gameId);
			return success;
		},

		// プレイ回数増加
		incrementPlayCount: async (gameId: number) => {
			const { data } = await apiClient.games.postApiV1GamesPlay(gameId);
			return data;
		},

		// いいね追加
		like: async (gameId: number) => {
			const { data } = await apiClient.games.postApiV1GamesLikes(gameId);
			return data;
		},

		// いいね取り消し
		unlike: async (gameId: number) => {
			const { data } = await apiClient.games.deleteApiV1GamesLikes(gameId);
			return data;
		},

		getComments: async (gameId: number) => {
			const { data } = await apiClient.games.getApiV1GamesComments(gameId);
			return data as CommentResponse[];
		},

		// コメント投稿
		createComment: async (gameId: number, data: CreateCommentRequest) => {
			const { data: comment } = await apiClient.games.postApiV1GamesComments(
				gameId,
				data,
			);
			return comment as CommentResponse;
		},

		// コメント削除
		deleteComment: async (gameId: number, commentId: number) => {
			const { success } = await apiClient.games.deleteApiV1GamesComments(
				gameId,
				commentId,
			);
			return success;
		},

		// シーン関連
		scenes: {
			// シーン作成
			create: async (gameId: number, params: CreateSceneRequest) => {
				const { data } = await apiClient.games.postApiV1GamesScenes(
					gameId,
					params,
				);
				return data as SceneResponse;
			},

			// シーン更新
			update: async (
				gameId: number,
				sceneId: number,
				params: UpdateSceneRequest,
			) => {
				const { data } = await apiClient.games.putApiV1GamesScenes(
					gameId,
					sceneId,
					params,
				);
				return data as SceneResponse;
			},

			// シーン削除
			delete: async (gameId: number, sceneId: number) => {
				const { success } = await apiClient.games.deleteApiV1GamesScenes(
					gameId,
					sceneId,
				);
				return success;
			},

			// イベント関連
			events: {
				// イベント作成
				create: async (
					gameId: number,
					sceneId: number,
					data: CreateEventRequest,
				) => {
					const { data: event } =
						await apiClient.games.postApiV1GamesScenesEvents(
							gameId,
							sceneId,
							data,
						);
					return event as EventResponse;
				},

				// イベント順序変更
				move: async (
					gameId: number,
					sceneId: number,
					params: MoveEventRequest,
				) => {
					const { success } =
						await apiClient.games.putApiV1GamesScenesEventsMove(
							gameId,
							sceneId,
							params,
						);
					return success;
				},

				// イベント更新
				update: async (
					gameId: number,
					sceneId: number,
					eventId: number,
					params: UpdateEventRequest,
				) => {
					const { data } = await apiClient.games.putApiV1GamesScenesEvents(
						gameId,
						sceneId,
						eventId,
						params,
					);
					return data as EventResponse;
				},

				// イベント削除
				delete: async (gameId: number, sceneId: number, eventId: number) => {
					const { success } =
						await apiClient.games.deleteApiV1GamesScenesEvents(
							gameId,
							sceneId,
							eventId,
						);
					return success;
				},
			},
		},
	},

	// アセット関連
	assets: {
		upload: async (params: CreateAssetRequest) => {
			const { data } = await apiClient.assets.postApiV1Assets({
				file: params.file,
				assetType: params.assetType,
				name: params.name,
				metadata: JSON.stringify(params.metadata),
			});
			return data as AssetResponse;
		},

		// アセット更新
		update: async (assetId: number, data: UpdateAssetRequest) => {
			const { data: asset } = await apiClient.assets.putApiV1Assets(
				assetId,
				data,
			);
			return asset as AssetResponse;
		},

		// アセット削除
		delete: async (assetId: number) => {
			const { success } = await apiClient.assets.deleteApiV1Assets(assetId);
			return success;
		},
	},

	// キャラクター関連
	characters: {
		// キャラクター作成
		create: async (params: CreateCharacterRequest) => {
			const { data } = await apiClient.characters.postApiV1Characters(params);
			return data as CharacterResponse;
		},

		// キャラクター更新
		update: async (characterId: number, data: UpdateCharacterRequest) => {
			const { data: character } = await apiClient.characters.putApiV1Characters(
				characterId,
				data,
			);
			return character as CharacterResponse;
		},

		// キャラクター削除
		delete: async (characterId: number) => {
			const { success } =
				await apiClient.characters.deleteApiV1Characters(characterId);
			return success;
		},

		linkAsset: async (characterId: number, data: AssetCharacterLinkRequest) => {
			const { success } = await apiClient.characters.postApiV1CharactersAssets(
				characterId,
				data,
			);
			return success;
		},

		unlinkAsset: async (characterId: number, assetId: number) => {
			const { success } =
				await apiClient.characters.deleteApiV1CharactersAssets(
					characterId,
					assetId,
				);
			return success;
		},
	},
};
