import { db } from "@/server/shared/infrastructure/db";
import {
	UserNotFoundError,
	UserUnauthorizedError,
} from "../../users/domain/error";
import { userRepository } from "../../users/infrastructure/repository";

import { CommentNotFoundError, GameNotFoundError } from "../domain/error";
import type { Game } from "../domain/game";
import type { Scene } from "../domain/scene";
import type { CommentRepository } from "../infrastructure/repositories/comment";
import type {
	EventRepository,
	GameRepository,
	SceneRepository,
	StatisticsRepository,
} from "../infrastructure/repository";
import {
	type CreateCommentRequest,
	type CreateEventRequest,
	type CreateGameDto,
	type CreateSceneRequest,
	type MoveEventRequest,
	type UpdateEventRequest,
	type UpdateGameDto,
	type UpdateSceneRequest,
	mapDomainToCommentResponseDto,
	mapDomainToDetailResponseDto,
	mapDomainToEventResponseDto,
	mapDomainToResponseDto,
	mapDomainToSceneResponseDto,
} from "./dto";

export const createCommand = ({
	gameRepository,
	sceneRepository,
	eventRepository,
	statisticsRepository,
	commentRepository,
}: {
	gameRepository: GameRepository;
	sceneRepository: SceneRepository;
	eventRepository: EventRepository;
	statisticsRepository: StatisticsRepository;
	commentRepository: CommentRepository;
}) => {
	return {
		executePlayGame: async (
			gamePublicId: string,
			userId: number | undefined | null,
			guestId: string | undefined | null,
		) => {
			const count = await statisticsRepository.playGame(
				gamePublicId,
				userId,
				guestId,
			);
			return count;
		},

		executeCreateGame: async (dto: CreateGameDto, userId: number) => {
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
						gamePublicId: game.publicId,
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

				const event = await eventRepository.createEvent({
					params: {
						gamePublicId: game.publicId,
						scenePublicId: scene.publicId,
						type: "textRender",
						userId,
					},
					tx,
				});

				scene.events = [event];

				const user = await userRepository.getById(userId);

				if (!user) {
					throw new Error("User not found");
				}

				return mapDomainToDetailResponseDto(
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
			gamePublicId: string,
			status: Game["status"],
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gamePublicId, tx);
				if (!game) {
					throw new GameNotFoundError(gamePublicId);
				}
				// ユーザーが所有者か確認
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const updatedGame = await gameRepository.updateGameStatus({
					params: { gamePublicId, status },
					tx,
				});

				return mapDomainToResponseDto(updatedGame);
			});
		},

		executeUpdateGame: async (
			gamePublicId: string,
			dto: UpdateGameDto,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gamePublicId, tx);
				if (!game) {
					throw new GameNotFoundError(gamePublicId);
				}
				// ユーザーが所有者か確認
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const updatedGame = await gameRepository.updateGame({
					gamePublicId,
					params: dto,
					tx,
				});

				return mapDomainToResponseDto(updatedGame);
			});
		},

		executeDeleteGame: async (gamePublicId: string, userId: number) => {
			return await db.transaction(async (tx) => {
				const game = await gameRepository.getGameById(gamePublicId);
				if (!game) {
					throw new GameNotFoundError(gamePublicId);
				}
				// ユーザーが所有者か確認
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				await gameRepository.deleteGame({
					params: { gamePublicId },
					tx,
				});

				return { success: true };
			});
		},

		// いいね追加
		executeLikeGame: async (gamePublicId: string, userId: number) => {
			const count = await statisticsRepository.likeGame(gamePublicId, userId);
			return count;
		},

		// いいね取り消し
		executeUnlikeGame: async (gamePublicId: string, userId: number) => {
			const count = await statisticsRepository.unlikeGame(gamePublicId, userId);
			return count;
		},

		// コメント投稿
		executeCreateComment: async (
			gamePublicId: string,
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
						gamePublicId,
						userPublicId: user.publicId,
						content: dto.content,
					},
					tx,
				});

				return mapDomainToCommentResponseDto(comment);
			});
		},

		executeDeleteComment: async (commentPublicId: string, userId: number) => {
			// ユーザーが所有者か確認
			const comment =
				await commentRepository.getCommentByPublicId(commentPublicId);

			if (!comment) {
				throw new CommentNotFoundError(commentPublicId);
			}

			const user = await userRepository.getById(userId);
			if (!user) {
				throw new UserNotFoundError("");
			}

			if (comment.userPublicId !== user.publicId) {
				throw new UserUnauthorizedError();
			}

			await commentRepository.deleteComment({
				params: { commentPublicId },
			});

			return { success: true };
		},

		executeCreateScene: async (
			gamePublicId: string,
			dto: CreateSceneRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				// ユーザーが所有者か確認
				const game = await gameRepository.getGameById(gamePublicId);
				if (!game) {
					throw new Error("Game not found");
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const scene = await sceneRepository.createScene({
					params: { ...dto, gamePublicId, userId },
					tx,
				});

				return mapDomainToSceneResponseDto(scene);
			});
		},

		executeUpdateScene: async (
			gamePublicId: string,
			scenePublicId: string,
			dto: UpdateSceneRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				// ユーザーが所有者か確認
				const game = await gameRepository.getGameById(gamePublicId);
				if (!game) {
					throw new Error("Game not found");
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				// シーンの情報を取得
				const scenes = await sceneRepository.getScenes(game.publicId);
				if (!scenes) {
					throw new Error("Scenes not found");
				}

				const sceneToUpdate = scenes.find((s) => s.publicId === scenePublicId);
				if (!sceneToUpdate) {
					throw new Error("Scene not found");
				}

				// シーンを更新
				const updatedScene = await sceneRepository.updateScene({
					scenePublicId,
					params: { ...dto },
					tx,
				});

				return mapDomainToSceneResponseDto(updatedScene);
			});
		},

		// シーン削除
		executeDeleteScene: async (
			gamePublicId: string,
			scenePublicId: string,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				// ユーザーが所有者か確認
				const game = await gameRepository.getGameById(gamePublicId);
				if (!game) {
					throw new Error("Game not found");
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				await sceneRepository.deleteScene({
					params: { gamePublicId, scenePublicId },
					tx,
				});

				return { success: true };
			});
		},

		// イベント作成
		executeCreateEvent: async (
			gamePublicId: string,
			scenePublicId: string,
			dto: CreateEventRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				// ユーザーが所有者か確認
				const game = await gameRepository.getGameById(gamePublicId);
				if (!game) {
					throw new Error("Game not found");
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				const event = await eventRepository.createEvent({
					params: {
						gamePublicId,
						scenePublicId,
						type: dto.type,
						orderIndex: dto.orderIndex,
						userId,
					},
					tx,
				});

				return mapDomainToEventResponseDto(event);
			});
		},

		// イベント更新
		executeUpdateEvent: async (
			gamePublicId: string,
			scenePublicId: string,
			eventPublicId: string,
			dto: UpdateEventRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				// ユーザーが所有者か確認
				const game = await gameRepository.getGameById(gamePublicId);
				if (!game) {
					throw new Error("Game not found");
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				// イベントを取得
				const scenes = await sceneRepository.getScenes(game.publicId);
				if (!scenes) {
					throw new Error("Scenes not found");
				}

				const scene = scenes.find((s) => s.publicId === scenePublicId);
				if (!scene) {
					throw new Error("Scene not found");
				}

				const eventMap = await eventRepository.getEvents([scene.id]);
				const events = eventMap[scene.id] || [];
				const eventToUpdate = events.find((e) => e.publicId === eventPublicId);

				if (!eventToUpdate) {
					throw new Error("Event not found");
				}

				// イベントを更新
				const updatedEvent = await eventRepository.updateEvent({
					params: {
						eventData: {
							...eventToUpdate,
							...dto,
						},
						gamePublicId,
					},
					tx,
				});

				return mapDomainToEventResponseDto(updatedEvent);
			});
		},

		// イベント削除
		executeDeleteEvent: async (
			gamePublicId: string,
			eventPublicId: string,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				// ユーザーが所有者か確認
				const game = await gameRepository.getGameById(gamePublicId);
				if (!game) {
					throw new Error("Game not found");
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				await eventRepository.deleteEvent({
					params: { eventPublicId },
					tx,
				});

				return { success: true };
			});
		},

		executeMoveEvent: async (
			gamePublicId: string,
			scenePublicId: string,
			dto: MoveEventRequest,
			userId: number,
		) => {
			return await db.transaction(async (tx) => {
				// ユーザーが所有者か確認
				const game = await gameRepository.getGameById(gamePublicId);
				if (!game) {
					throw new Error("Game not found");
				}
				if (game.userId !== userId) {
					throw new UserUnauthorizedError();
				}

				// シーンの存在を確認
				const scenes = await sceneRepository.getScenes(gamePublicId);
				if (!scenes) {
					throw new Error("Scenes not found");
				}

				const scene = scenes.find((s) => s.publicId === scenePublicId);
				if (!scene) {
					throw new Error("Scene not found");
				}

				// イベントの順序を変更
				const result = await eventRepository.moveEvent({
					params: {
						oldIndex: dto.oldIndex,
						newIndex: dto.newIndex,
						scenePublicId,
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
