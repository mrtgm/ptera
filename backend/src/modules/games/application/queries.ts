import { HTTPException } from "hono/http-exception";
import type { UserRepository } from "~/modules/users/infrastructure/repository";
import type { GetGamesRequest } from "../api/validator";
import {
	GameNotFoundError,
	InitialSceneNotFoundError,
	ScenesNotFoundError,
	UserNotFoundError,
} from "../domain/error";
import type { GameWithScene } from "../domain/game";
import type { GameRepository } from "../infrastructure/repository";
import {
	type GameDetailResponseDto,
	type GameListResponseDto,
	mapDomainToDetailResponseDto,
	mapDomainToListResponseDto,
	mapDomainToResourceResponseDto,
} from "./dto";

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
		): Promise<{ items: GameListResponseDto[]; total: number }> => {
			const { items, total } = await gameRepository.getGames(params);
			const userIds = items.map((v) => v.userId);
			const users = await userRepository.getUsersByIds(userIds);
			return {
				items: mapDomainToListResponseDto(items, users),
				total,
			};
		},

		executeGetAsset: async (publicId: string) => {
			const game = await gameRepository.getGameById(publicId);

			if (!game) {
				throw new GameNotFoundError(publicId);
			}

			const resources = await gameRepository.getResource(game.id);
			return mapDomainToResourceResponseDto(resources);
		},

		executeGetGame: async (
			publicId: string,
		): Promise<GameDetailResponseDto> => {
			const game = await gameRepository.getGameById(publicId);

			if (!game) {
				throw new GameNotFoundError(publicId);
			}

			const initialSceneIdMap = await gameRepository.getGameInitialScenes([
				game.id,
			]);
			const scenes = await gameRepository.getScenes(game.id);
			const user = await userRepository.getById(game.userId);

			if (initialSceneIdMap === null) {
				throw new InitialSceneNotFoundError(game.id);
			}
			if (!scenes) {
				throw new ScenesNotFoundError(game.id);
			}
			if (!user) {
				throw new UserNotFoundError(game.userId);
			}

			const eventMap = await gameRepository.getEvents(scenes.map((v) => v.id));

			for (const scene of scenes) {
				scene.events = eventMap[scene.id] || [];
			}

			const gameWithScene: GameWithScene = {
				...game,
				initialSceneId: initialSceneIdMap[game.id],
				scenes,
			};

			return mapDomainToDetailResponseDto(gameWithScene, user);
		},
	};
};
