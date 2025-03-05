import type { UserRepository } from "~/modules/users/infrastructure/repository";
import type { GetGamesRequest } from "../api/validator";
import type { GameRepository } from "../infrastructure/repository";
import { type GameResponseDto, mapGameToResponseDto } from "./dto";

export const createQuery = ({
	gameRepository,
	userRepository,
}: {
	gameRepository: GameRepository;
	userRepository: UserRepository;
}) => {
	return {
		executeSearch: async (
			params: GetGamesRequest,
		): Promise<{ items: GameResponseDto[]; total: number }> => {
			const { items, total } = await gameRepository.getGames(params);
			const gameIds = items.map((item) => item.id);

			// シーン情報の取得
			const initialScenesByGameId =
				await gameRepository.getInitialScenesByGameIds(gameIds);

			// いいね数の取得
			const likeCountByGameId = await gameRepository.getLikesByGameIds(gameIds);

			// プレイ数の取得
			const playCountByGameId =
				await gameRepository.getPlayerCountByGameIds(gameIds);

			// カテゴリ情報の取得
			const categoriesByGameId =
				await gameRepository.getCategoriesByGameIds(gameIds);

			// ユーザー情報の取得
			const userIds = items.map((v) => v.userId);
			const users = await userRepository.findUsersByIds(userIds);

			const dtos: GameResponseDto[] = items
				.map((item) =>
					mapGameToResponseDto(
						item,
						initialScenesByGameId[item.id],
						likeCountByGameId[item.id],
						playCountByGameId[item.id],
						categoriesByGameId[item.id],
						users[item.userId],
					),
				)
				.sort((a, b) => {
					const first = params.order === "asc" ? a : b;
					const second = params.order === "asc" ? b : a;

					if (params.sort === "likeCount") {
						return (first.likeCount || 0) - (second.likeCount || 0);
					}
					if (params.sort === "playCount") {
						return (first.playCount || 0) - (second.playCount || 0);
					}
					if (params.sort === "createdAt") {
						return (
							new Date(first.createdAt).getTime() -
							new Date(second.createdAt).getTime()
						);
					}
					return 0;
				});

			return {
				items: dtos,
				total,
			};
		},
	};
};
