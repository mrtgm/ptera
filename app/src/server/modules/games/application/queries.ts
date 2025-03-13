import type { UserRepository } from "@/server/modules/users/infrastructure/repository";
import { HTTPException } from "hono/http-exception";
import { UserNotFoundError } from "../../users/domain/error";
import type { GetCommentsRequest, GetGamesRequest } from "../api/validator";
import {
	GameNotFoundError,
	InitialSceneNotFoundError,
	ScenesNotFoundError,
} from "../domain/error";
import type { GameWithScene } from "../domain/game";
import type { CommentRepository } from "../infrastructure/repositories/comment";
import type {
	EventRepository,
	GameRepository,
	ResourceRepository,
	SceneRepository,
	StatisticsRepository,
} from "../infrastructure/repository";
import {
	type CommentResponseDto,
	type GameDetailResponseDto,
	type GameListResponseDto,
	mapDomainToCommentResponseDto,
	mapDomainToDetailResponseDto,
	mapDomainToListResponseDto,
	mapDomainToResourceResponseDto,
} from "./dto";

export const createQuery = ({
	gameRepository,
	userRepository,
	eventRepository,
	sceneRepository,
	resourceRepository,
	statisticsRepository,
	commentRepository,
}: {
	gameRepository: GameRepository;
	statisticsRepository: StatisticsRepository;
	eventRepository: EventRepository;
	sceneRepository: SceneRepository;
	resourceRepository: ResourceRepository;
	userRepository: UserRepository;
	commentRepository: CommentRepository;
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

			const resources = await resourceRepository.getResource(publicId);
			return mapDomainToResourceResponseDto(resources);
		},

		executeGetGame: async (
			publicId: string,
		): Promise<GameDetailResponseDto> => {
			const game = await gameRepository.getGameById(publicId);

			if (!game) {
				throw new GameNotFoundError(publicId);
			}

			const initialSceneIdMap = await statisticsRepository.getGameInitialScenes(
				[game.id],
			);

			const scenes = await sceneRepository.getScenes(publicId);
			const user = await userRepository.getById(game.userId);

			if (initialSceneIdMap === null) {
				throw new InitialSceneNotFoundError(publicId);
			}
			if (!scenes) {
				throw new ScenesNotFoundError(publicId);
			}
			if (!user) {
				throw new UserNotFoundError("User not found");
			}

			const eventMap = await eventRepository.getEvents(scenes.map((v) => v.id));

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

		executeGetComments: async (
			gamePublicId: string,
			params: GetCommentsRequest,
		): Promise<{ items: CommentResponseDto[]; total: number }> => {
			const game = await gameRepository.getGameById(gamePublicId);
			if (!game) {
				throw new GameNotFoundError(gamePublicId);
			}
			const { items, total } = await commentRepository.getComments(
				gamePublicId,
				params,
			);

			const mappedItems = items.map((v) => {
				return mapDomainToCommentResponseDto(v);
			});

			return {
				items: mappedItems,
				total,
			};
		},
	};
};
