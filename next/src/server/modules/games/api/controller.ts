import type { Context } from "hono";
import { hc } from "hono/client";
import { getCookie, setCookie } from "hono/cookie";
import { honoWithHook } from "../../../lib/hono";
import {
	errorResponse,
	successWithDataResponse,
	successWithPaginationResponse,
	successWithoutDataResponse,
} from "../../../shared/schema/response";
import { ResourceRepository } from "../../assets/infrastructure/repositories/resource";
import { userRepository } from "../../users/infrastructure/repository";
import { createCommand } from "../application/commands";
import { createQuery } from "../application/queries";
import { CommentRepository } from "../infrastructure/repositories/comment";
import {
	CategoryRepository,
	EventRepository,
	GameRepository,
	SceneRepository,
	StatisticsRepository,
} from "../infrastructure/repository";
import { errorHandler } from "./error-handler";
import { gameRouteCongfigs } from "./routes";

const gameRepository = new GameRepository();
const sceneRepository = new SceneRepository();
const eventRepository = new EventRepository();
const resourceRepository = new ResourceRepository();
const statisticsRepository = new StatisticsRepository();
const commentRepository = new CommentRepository();
const categoryRepository = new CategoryRepository();

const queries = createQuery({
	gameRepository,
	statisticsRepository,
	eventRepository,
	sceneRepository,
	resourceRepository,
	userRepository,
	commentRepository,
	categoryRepository,
});

const commands = createCommand({
	gameRepository,
	sceneRepository,
	eventRepository,
	statisticsRepository,
	commentRepository,
	categoryRepository,
});

const setGuestId = (c: Context) => {
	const newGuestId = crypto.randomUUID();
	setCookie(c, "guestId", newGuestId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
		sameSite: "strict",
	});
	return newGuestId;
};

const gameRoutes = honoWithHook();

gameRoutes
	.openapi(gameRouteCongfigs.getCategories, async (c) => {
		const result = await queries.executeGetCategories();
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.getGame, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const result = await queries.executeGetGame(gameId);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.getAsset, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const result = await queries.executeGetAsset(gameId);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.getGames, async (c) => {
		const query = c.req.valid("query");
		const result = await queries.executeSearch(query);
		return successWithPaginationResponse(c, result);
	})
	.openapi(gameRouteCongfigs.createGame, async (c) => {
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const result = await commands.executeCreateGame(dto, userId);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.updateGame, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const result = await commands.executeUpdateGame(gameId, dto, userId);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.updateGameStatus, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const status = c.req.valid("json").status;
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const result = await commands.executeUpdateGameStatus(
			gameId,
			status,
			userId,
		);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.playGame, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const userId = c.get("user")?.id;
		let guestId = null;

		if (!userId) {
			guestId = await getCookie(c, "guestId");
			if (!guestId) guestId = setGuestId(c);
		}

		const count = await commands.executePlayGame(gameId, userId, guestId);
		return successWithDataResponse(c, count);
	})
	.openapi(gameRouteCongfigs.deleteGame, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		await commands.executeDeleteGame(gameId, userId);
		return successWithoutDataResponse(c);
	})
	.openapi(gameRouteCongfigs.likeGame, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const count = await commands.executeLikeGame(gameId, userId);
		return successWithDataResponse(c, count);
	})
	.openapi(gameRouteCongfigs.unlikeGame, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const count = await commands.executeUnlikeGame(gameId, userId);
		return successWithDataResponse(c, count);
	})
	.openapi(gameRouteCongfigs.getComments, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const result = await queries.executeGetComments(gameId);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.createComment, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const result = await commands.executeCreateComment(gameId, dto, userId);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.deleteComment, async (c) => {
		const { commentId } = c.req.valid("param");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		await commands.executeDeleteComment(commentId, userId);
		return successWithoutDataResponse(c);
	})
	.openapi(gameRouteCongfigs.getScene, async (c) => {
		const { gameId, sceneId } = c.req.valid("param");
		const result = await queries.executeGetScene(sceneId);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.createScene, async (c) => {
		const gameId = c.req.valid("param").gameId;
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const result = await commands.executeCreateScene(gameId, dto, userId);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.updateSceneSetting, async (c) => {
		const { gameId, sceneId } = c.req.valid("param");
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const result = await commands.executeUpdateSceneSetting(
			gameId,
			sceneId,
			dto,
			userId,
		);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.updateScene, async (c) => {
		const { gameId, sceneId } = c.req.valid("param");
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const result = await commands.executeUpdateScene(
			gameId,
			sceneId,
			dto,
			userId,
		);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.deleteScene, async (c) => {
		const { gameId, sceneId } = c.req.valid("param");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		await commands.executeDeleteScene(gameId, sceneId, userId);
		return successWithoutDataResponse(c);
	})
	.openapi(gameRouteCongfigs.createEvent, async (c) => {
		const { gameId, sceneId } = c.req.valid("param");
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const result = await commands.executeCreateEvent(
			gameId,
			sceneId,
			dto,
			userId,
		);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.moveEvent, async (c) => {
		const { gameId, sceneId } = c.req.valid("param");
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		await commands.executeMoveEvent(gameId, sceneId, dto, userId);
		return successWithoutDataResponse(c);
	})
	.openapi(gameRouteCongfigs.updateEvent, async (c) => {
		const { gameId, sceneId, eventId } = c.req.valid("param");
		const dto = c.req.valid("json");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		const result = await commands.executeUpdateEvent(
			gameId,
			sceneId,
			eventId,
			dto,
			userId,
		);
		return successWithDataResponse(c, result);
	})
	.openapi(gameRouteCongfigs.deleteEvent, async (c) => {
		const { gameId, eventId } = c.req.valid("param");
		const userId = c.get("user")?.id;
		if (!userId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}
		await commands.executeDeleteEvent(gameId, eventId, userId);
		return successWithoutDataResponse(c);
	});

gameRoutes.onError(errorHandler);

// 未ログインユーザ向け Cookie
gameRoutes.use("*", async (c, next) => {
	const userId = c.get("user")?.id;
	if (!userId) {
		const guestId = await getCookie(c, "guestId");
		if (!guestId) {
			setGuestId(c);
		}
	}
	await next();
});

export { gameRoutes };
