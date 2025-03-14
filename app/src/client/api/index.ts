import { ENV } from "@/configs/env";
import type {
	AssetCharacterLinkRequest,
	CreateAssetRequest,
	CreateCharacterRequest,
	UpdateAssetRequest,
	UpdateCharacterRequest,
} from "@/schemas/assets/dto";
import type {
	CreateCommentRequest,
	CreateEventRequest,
	CreateGameRequest,
	CreateSceneRequest,
	GetCommentsRequest,
	GetGamesRequest,
	MoveEventRequest,
	UpdateEventRequest,
	UpdateGameRequest,
	UpdateGameStatusRequest,
	UpdateSceneRequest,
} from "@/schemas/games/dto";
import type { UpdateProfileRequest } from "@/schemas/users/dto";
import { type ClientResponse, hc } from "hono/client";
import type { AppType } from "ptera/server-types";

const client = hc<AppType>(
	process.env.NODE_ENV === "production"
		? `https://${ENV.DOMAIN_NAME}/api/v1`
		: "http://localhost:3000/api/v1",
);
type ApiResponse<T = unknown> = {
	success?: boolean;
	data?: T;
	error?: {
		message: string;
		type: string;
		status: number;
	};
};

async function callApi<T>(
	apiCall: () => Promise<ClientResponse<ApiResponse<T>>>,
	errorHandler?: (error: unknown) => void,
): Promise<T | null> {
	try {
		const response = await apiCall();
		const res = (await response.json()) as ApiResponse<T>;

		if ("error" in res) {
			console.error("API Error:", res.error);
			if (errorHandler) errorHandler(res.error);
			return null;
		}

		return (res.data !== undefined ? res.data : res.success) as T;
	} catch (error) {
		console.error("API call failed:", error);
		if (errorHandler) errorHandler(error);
		return null;
	}
}

export const api = {
	// 認証関連
	auth: {
		// ログアウト
		logout: () => callApi<boolean>(() => client.auth.logout.$get()),

		// ログインユーザー情報取得
		me: () => callApi(() => client.auth.me.$get()),
		likedGames: () => callApi(() => client.me.liked.$get()),
	},

	// ユーザー関連
	users: {
		get: (userId: number) =>
			callApi(() =>
				client.users[":userId"].$get({
					param: { userId },
				}),
			),

		updateProfile: (userId: number, data: UpdateProfileRequest) =>
			callApi(() =>
				client.users[":userId"].profile.$put({
					param: { userId },
					json: data,
				}),
			),
	},

	// ゲーム関連
	games: {
		// カテゴリ一覧取得
		getCategories: () => callApi(() => client.games.categories.$get()),

		// ゲーム一覧取得（ページネーション）
		list: (filter: GetGamesRequest) =>
			callApi(() =>
				client.games.$get({
					query: filter,
				}),
			),

		// 特定のゲームを取得
		get: (gameId: number) =>
			callApi(() =>
				client.games[":gameId"].$get({
					param: { gameId },
				}),
			),

		// ゲーム作成
		create: (data: CreateGameRequest) =>
			callApi(() =>
				client.games.$post({
					json: data,
				}),
			),

		// ゲームアセット取得
		getAssets: (gameId: number) =>
			callApi(() =>
				client.games[":gameId"].assets.$get({
					param: { gameId },
				}),
			),

		// ゲーム更新
		update: (gameId: number, data: UpdateGameRequest) =>
			callApi(() =>
				client.games[":gameId"].$put({
					param: { gameId },
					json: data,
				}),
			),

		// ゲームステータス更新
		updateStatus: (gameId: number, data: UpdateGameStatusRequest) =>
			callApi(() =>
				client.games[":gameId"].status.$put({
					param: { gameId },
					json: data,
				}),
			),

		// ゲーム削除
		delete: (gameId: number) =>
			callApi(() =>
				client.games[":gameId"].$delete({
					param: { gameId },
				}),
			),

		// プレイ回数増加
		incrementPlayCount: (gameId: number) =>
			callApi(() =>
				client.games[":gameId"].play.$post({
					param: { gameId },
				}),
			),

		// いいね追加
		like: (gameId: number) =>
			callApi(() =>
				client.games[":gameId"].likes.$post({
					param: { gameId },
				}),
			),

		// いいね取り消し
		unlike: (gameId: number) =>
			callApi(() =>
				client.games[":gameId"].likes.$delete({
					param: { gameId },
				}),
			),

		// コメント一覧取得（ページネーション）
		getComments: (gameId: number) =>
			callApi(() =>
				client.games[":gameId"].comments.$get({
					param: { gameId },
				}),
			),

		// コメント投稿
		createComment: (gameId: number, data: CreateCommentRequest) =>
			callApi(() =>
				client.games[":gameId"].comments.$post({
					param: { gameId },
					json: data,
				}),
			),

		// コメント削除
		deleteComment: (gameId: number, commentId: number) =>
			callApi(() =>
				client.games[":gameId"].comments[":commentId"].$delete({
					param: { gameId, commentId },
				}),
			),

		// シーン関連
		scenes: {
			// シーン作成
			create: (gameId: number, data: CreateSceneRequest) =>
				callApi(() =>
					client.games[":gameId"].scenes.$post({
						param: { gameId },
						json: data,
					}),
				),

			// シーン更新
			update: (gameId: number, sceneId: number, data: UpdateSceneRequest) =>
				callApi(() =>
					client.games[":gameId"].scenes[":sceneId"].$put({
						param: { gameId, sceneId },
						json: data,
					}),
				),

			// シーン削除
			delete: (gameId: number, sceneId: number) =>
				callApi(() =>
					client.games[":gameId"].scenes[":sceneId"].$delete({
						param: { gameId, sceneId },
					}),
				),

			// イベント関連
			events: {
				// イベント作成
				create: (gameId: number, sceneId: number, data: CreateEventRequest) =>
					callApi(() =>
						client.games[":gameId"].scenes[":sceneId"].events.$post({
							param: { gameId, sceneId },
							json: data,
						}),
					),

				// イベント順序変更
				move: (gameId: number, sceneId: number, data: MoveEventRequest) =>
					callApi(() =>
						client.games[":gameId"].scenes[":sceneId"].events.move.$put({
							param: { gameId, sceneId },
							json: data,
						}),
					),

				// イベント更新
				update: (
					gameId: number,
					sceneId: number,
					eventId: number,
					data: UpdateEventRequest,
				) =>
					callApi(() =>
						client.games[":gameId"].scenes[":sceneId"].events[":eventId"].$put({
							param: { gameId, sceneId, eventId },
							json: data,
						}),
					),

				// イベント削除
				delete: (gameId: number, sceneId: number, eventId: number) =>
					callApi(() =>
						client.games[":gameId"].scenes[":sceneId"].events[
							":eventId"
						].$delete({
							param: { gameId, sceneId, eventId },
						}),
					),
			},
		},
	},

	// アセット関連
	assets: {
		upload: (data: CreateAssetRequest) => {
			return callApi(() =>
				client.assets.$post({
					form: {
						file: data.file,
						assetType: data.assetType,
						name: data.name,
						metadata: JSON.stringify(data.metadata),
					},
				}),
			);
		},

		// アセット更新
		update: (assetId: number, data: UpdateAssetRequest) =>
			callApi(() =>
				client.assets[":assetId"].$put({
					param: { assetId },
					json: data,
				}),
			),

		// アセット削除
		delete: (assetId: number) =>
			callApi(() =>
				client.assets[":assetId"].$delete({
					param: { assetId },
				}),
			),
	},

	// キャラクター関連
	characters: {
		// キャラクター作成
		create: (data: CreateCharacterRequest) =>
			callApi(() =>
				client.characters.$post({
					json: data,
				}),
			),

		// キャラクター更新
		update: (characterId: number, data: UpdateCharacterRequest) =>
			callApi(() =>
				client.characters[":characterId"].$put({
					param: { characterId },
					json: data,
				}),
			),

		// キャラクター削除
		delete: (characterId: number) =>
			callApi(() =>
				client.characters[":characterId"].$delete({
					param: { characterId },
				}),
			),

		linkAsset: (characterId: number, data: AssetCharacterLinkRequest) =>
			callApi(() =>
				client.characters[":characterId"].assets.$post({
					param: { characterId },
					json: data,
				}),
			),

		unlinkAsset: (characterId: number, assetId: number) =>
			callApi(() =>
				client.characters[":characterId"].assets[":assetId"].$delete({
					param: { characterId, assetId },
				}),
			),
	},
};
