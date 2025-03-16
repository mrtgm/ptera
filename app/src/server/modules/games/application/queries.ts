import type { UserRepository } from "@/server/modules/users/infrastructure/repository";
import {
	GameNotFoundError,
	InitialSceneNotFoundError,
	SceneNotFoundError,
	ScenesNotFoundError,
} from "~/schemas/games/domain/error";
import type { GameWithScene } from "~/schemas/games/domain/game";
import {
	type CommentResponse,
	type GameDetailResponse,
	type GameListResponse,
	type GetCommentsRequest,
	type GetGamesRequest,
	mapDomainToCategoryResponse,
	mapDomainToCommentResponse,
	mapDomainToGameDetailResponse,
	mapDomainToGameListResponse,
	mapDomainToResourceResponse,
} from "~/schemas/games/dto";
import { UserNotFoundError } from "../../../../schemas/users/domain/error";
import type { ResourceRepository } from "../../assets/infrastructure/repositories/resource";
import type { CommentRepository } from "../infrastructure/repositories/comment";
import type {
	CategoryRepository,
	EventRepository,
	GameRepository,
	SceneRepository,
	StatisticsRepository,
} from "../infrastructure/repository";

export const createQuery = ({
	gameRepository,
	userRepository,
	eventRepository,
	sceneRepository,
	resourceRepository,
	statisticsRepository,
	commentRepository,
	categoryRepository,
}: {
	gameRepository: GameRepository;
	statisticsRepository: StatisticsRepository;
	eventRepository: EventRepository;
	sceneRepository: SceneRepository;
	resourceRepository: ResourceRepository;
	userRepository: UserRepository;
	commentRepository: CommentRepository;
	categoryRepository: CategoryRepository;
}) => {
	return {
		executeSearch: async (
			params: GetGamesRequest,
		): Promise<{ items: GameListResponse[]; total: number }> => {
			const { items, total } = await gameRepository.getGames(params);
			const userIds = items.map((v) => v.userId);
			const users = await userRepository.getUsersByIds(userIds);
			return {
				items: mapDomainToGameListResponse(items, users),
				total,
			};
		},

		executeGetAsset: async (gameId: number) => {
			const game = await gameRepository.getGameById(gameId);

			if (!game) {
				throw new GameNotFoundError(gameId);
			}

			const resources = await resourceRepository.getResourceByGameId(gameId);
			return mapDomainToResourceResponse(resources);
		},

		executeGetGame: async (gameId: number): Promise<GameDetailResponse> => {
			const game = await gameRepository.getGameById(gameId);

			if (!game) {
				throw new GameNotFoundError(gameId);
			}

			const initialSceneIdMap = await statisticsRepository.getGameInitialScenes(
				[game.id],
			);

			const scenes = await sceneRepository.getScenes(gameId);
			const user = await userRepository.getById(game.userId);

			if (initialSceneIdMap === null) {
				throw new InitialSceneNotFoundError(gameId);
			}
			if (!scenes) {
				throw new ScenesNotFoundError(gameId);
			}
			if (!user) {
				throw new UserNotFoundError(game.userId);
			}

			const eventMap = await eventRepository.getEventsBySceneIds(
				scenes.map((v) => v.id),
			);

			for (const scene of scenes) {
				scene.events = eventMap[scene.id] || [];
			}

			const gameWithScene: GameWithScene = {
				...game,
				initialSceneId: initialSceneIdMap[game.id],
				scenes,
			};

			return mapDomainToGameDetailResponse(gameWithScene, user);
		},

		executeGetScene: async (sceneId: number) => {
			const scene = await sceneRepository.getSceneById(sceneId);
			if (!scene) {
				throw new SceneNotFoundError(sceneId);
			}
			return scene;
		},

		executeGetComments: async (gameId: number): Promise<CommentResponse[]> => {
			const game = await gameRepository.getGameById(gameId);
			if (!game) {
				throw new GameNotFoundError(gameId);
			}
			const comments = await commentRepository.getComments(gameId);

			const mappedItems = comments.map((v) => {
				return mapDomainToCommentResponse(v);
			});

			return mappedItems;
		},

		executeGetCategories: async () => {
			const res = await categoryRepository.getCategories();
			return res.map((v) => mapDomainToCategoryResponse(v));
		},
	};
};
