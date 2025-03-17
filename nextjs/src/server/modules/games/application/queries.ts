import {
  type CommentResponse,
  type GameDetailResponse,
  type GameListResponse,
  GameNotFoundError,
  type GameWithScene,
  type GetGamesRequest,
  InitialSceneNotFoundError,
  SceneNotFoundError,
  ScenesNotFoundError,
  UserNotFoundError,
  mapDomainToCategoryResponse,
  mapDomainToCommentResponse,
  mapDomainToGameDetailResponse,
  mapDomainToGameListResponse,
  mapDomainToResourceResponse,
} from "@ptera/schema";
import type { ResourceRepository } from "../../assets/infrastructure/repositories/resource";
import type { UserRepository } from "../../users/infrastructure/repository";
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
      console.log("---executeGetGame---");

      const game = await gameRepository.getGameById(gameId);

      console.log("---game---");

      if (!game) {
        throw new GameNotFoundError(gameId);
      }

      const initialSceneIdMap = await statisticsRepository.getGameInitialScenes(
        [game.id],
      );

      console.log("---initialSceneIdMap---");

      const scenes = await sceneRepository.getScenes(gameId);

      console.log("---scenes---");

      const user = await userRepository.getById(game.userId);

      console.log("---user---");

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

      console.log("---eventMap---");

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
