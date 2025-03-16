import { db } from "@/server/shared/infrastructure/db";
import {
	UserNotFoundError,
	UserUnauthorizedError,
} from "../../../../schemas/users/domain/error";
import { userRepository } from "../../users/infrastructure/repository";

import {
	CommentNotFoundError,
	GameNotFoundError,
	SceneNotFoundError,
} from "~/schemas/games/domain/error";
import type { Game } from "~/schemas/games/domain/game";
import {
	type CreateCommentRequest,
	type CreateEventRequest,
	type CreateGameRequest,
	type CreateSceneRequest,
	type MoveEventRequest,
	type UpdateEventRequest,
	type UpdateGameRequest,
	type UpdateSceneRequest,
	type UpdateSceneSettingRequest,
	mapDomainToCommentResponse,
	mapDomainToEventResponse,
	mapDomainToGameDetailResponse,
	mapDomainToGameResponse,
	mapDomainToSceneResponse,
} from "~/schemas/games/dto";
import type { CommentRepository } from "../infrastructure/repositories/comment";
import type {
	CategoryRepository,
	EventRepository,
	GameRepository,
	SceneRepository,
	StatisticsRepository,
} from "../infrastructure/repository";

export const createCommand = ({
	gameRepository,
	sceneRepository,
	eventRepository,
	statisticsRepository,
	commentRepository,
	categoryRepository,
}: {
	gameRepository: GameRepository;
	sceneRepository: SceneRepository;
	eventRepository: EventRepository;
	statisticsRepository: StatisticsRepository;
	commentRepository: CommentRepository;
	categoryRepository: CategoryRepository;
}) => {
	return {
		executeGetCategories: async () => {
			const categories = await categoryRepository.getCategories();
			return categories;
		},

		executePlayGame: async (
			gameId: number,
			userId: number | undefined | null,
			guestId: string | undefined | null,
		) => {
			const count = await statisticsRepository.playGame(
				gameId,
				userId,
				guestId,
			);
			return count;
		},

		executeCreateGame: async (dto: CreateGameRequest, userId: number) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.createGame({
					params: {
						name: dto.name,
						description: dto.description,
						userId: userId,
					},
					tx,
				});

				const scene = await sceneRepository.createScene({
					params: {
						gameId: game.id,
						userId,
						name: "Start",
					},
					tx,
				});

				await sceneRepository.createInitialScene({
					params: {
						gameId: game.id,
						sceneId: scene.id,
					},
					tx,
				});

				const user = await userRepository.getById(userId);

				if (!user) {
					throw new UserNotFoundError(userId);
				}

				return mapDomainToGameDetailResponse(
					{
						...game,
						initialSceneId: scene.id,
						scenes: [scene],
					},
					user,
				);
			});
		},

		executeUpdateGameStatus: async (
			gameId: number,
			status: Game["status"],
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId, tx);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				// ユーザーが所有者か確認
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const updatedGame = await gameRepository.updateGameStatus({
					params: { gameId, status },
					tx,
				});

				return mapDomainToGameResponse(updatedGame);
			});
		},

		executeUpdateGame: async (
			gameId: number,
			dto: UpdateGameRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId, tx);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				// ユーザーが所有者か確認
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const updatedGame = await gameRepository.updateGame({
					gameId,
					params: dto,
					tx,
				});

				return mapDomainToGameResponse(updatedGame);
			});
		},

		executeDeleteGame: async (gameId: number, userId: number) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				// ユーザーが所有者か確認
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				await gameRepository.deleteGame({
					params: { gameId },
					tx,
				});

				return { success: true };
			});
		},

		// いいね追加
		executeLikeGame: async (gameId: number, userId: number) => {
			const count = await statisticsRepository.likeGame(gameId, userId);
			return count;
		},

		// いいね取り消し
		executeUnlikeGame: async (gameId: number, userId: number) => {
			const count = await statisticsRepository.unlikeGame(gameId, userId);
			return count;
		},

		// コメント投稿
		executeCreateComment: async (
			gameId: number,
			dto: CreateCommentRequest,
			userId: number,
		) => {
			const user = await userRepository.getById(userId);
			if (!user) {
				throw new Error("User not found");
			}

			return await db.transaction(async (tx) => {
				const comment = await commentRepository.createComment({
					params: {
						gameId,
						userId: user.id,
						content: dto.content,
					},
					tx,
				});

				return mapDomainToCommentResponse(comment);
			});
		},

		executeDeleteComment: async (commentId: number, userId: number) => {
			return await db.transaction(async (tx) => {
				// ユーザーが所有者か確認
				const comment = await commentRepository.getCommentById(commentId);
				if (!comment) {
					throw new CommentNotFoundError(commentId);
				}

				const user = await userRepository.getById(userId);
				if (!user) {
					throw new UserNotFoundError(userId);
				}

				if (comment.userId !== user.id) {
					throw new UserUnauthorizedError();
				}

				await commentRepository.deleteComment({
					params: { commentId },
					tx,
				});

				return { success: true };
			});
		},

		executeCreateScene: async (
			gameId: number,
			dto: CreateSceneRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				// ユーザーが所有者か確認
				const game = await gameRepository.getGameById(gameId);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const scene = await sceneRepository.createScene({
					params: { ...dto, gameId, userId },
					tx,
				});

				return mapDomainToSceneResponse(scene);
			});
		},

		executeUpdateSceneSetting: async (
			gameId: number,
			sceneId: number,
			dto: UpdateSceneSettingRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const scenes = await sceneRepository.getScenes(gameId);
				if (!scenes) {
					throw new SceneNotFoundError(sceneId);
				}

				const sceneToUpdate = scenes.find((s) => s.id === sceneId);
				if (!sceneToUpdate) {
					throw new SceneNotFoundError(sceneId);
				}

				const updatedScene = await sceneRepository.updateSceneSetting({
					sceneId,
					params: { ...dto },
					tx,
				});

				return mapDomainToSceneResponse(updatedScene);
			});
		},

		executeUpdateScene: async (
			gameId: number,
			sceneId: number,
			dto: UpdateSceneRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}
				const scenes = await sceneRepository.getScenes(gameId);
				if (!scenes) {
					throw new SceneNotFoundError(sceneId);
				}
				const sceneToUpdate = scenes.find((s) => s.id === sceneId);
				if (!sceneToUpdate) {
					throw new SceneNotFoundError(sceneId);
				}

				const updatedScene = await sceneRepository.updateScene({
					sceneId,
					params: { ...dto },
					tx,
				});

				return mapDomainToSceneResponse(updatedScene);
			});
		},

		executeDeleteScene: async (
			gameId: number,
			sceneId: number,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				await sceneRepository.deleteScene({
					params: { gameId, sceneId },
					tx,
				});

				return { success: true };
			});
		},

		executeCreateEvent: async (
			gameId: number,
			sceneId: number,
			dto: CreateEventRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const event = await eventRepository.createEvent({
					params: {
						gameId,
						sceneId,
						type: dto.type,
						orderIndex: dto.orderIndex,
						userId,
					},
					tx,
				});

				return mapDomainToEventResponse(event);
			});
		},

		executeUpdateEvent: async (
			gameId: number,
			sceneId: number,
			eventId: number,
			dto: UpdateEventRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const scenes = await sceneRepository.getScenes(game.id);
				if (!scenes) {
					throw new SceneNotFoundError(sceneId);
				}

				const scene = scenes.find((s) => s.id === sceneId);
				if (!scene) {
					throw new SceneNotFoundError(sceneId);
				}

				const eventMap = await eventRepository.getEventsBySceneIds([scene.id]);
				const events = eventMap[scene.id] || [];
				const eventToUpdate = events.find((e) => e.id === eventId);

				if (!eventToUpdate) {
					throw new Error("Event not found");
				}

				const updatedEvent = await eventRepository.updateEvent({
					params: {
						eventData: {
							...eventToUpdate,
							...dto,
						},
						gameId,
					},
					tx,
				});

				return mapDomainToEventResponse(updatedEvent);
			});
		},

		executeDeleteEvent: async (
			gameId: number,
			eventId: number,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				await eventRepository.deleteEvent({
					params: { eventId },
					tx,
				});

				return { success: true };
			});
		},

		executeMoveEvent: async (
			gameId: number,
			sceneId: number,
			dto: MoveEventRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gameId);
				if (!game) {
					throw new GameNotFoundError(gameId);
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const scenes = await sceneRepository.getScenes(gameId);
				if (!scenes) {
					throw new SceneNotFoundError(sceneId);
				}

				const scene = scenes.find((s) => s.id === sceneId);
				if (!scene) {
					throw new SceneNotFoundError(sceneId);
				}

				const result = await eventRepository.moveEvent({
					params: {
						eventId: dto.eventId,
						newOrderIndex: dto.newOrderIndex,
					},
					tx,
				});

				if (!result) {
					throw new Error("Failed to move event");
				}

				return { success: true };
			});
		},
	};
};
