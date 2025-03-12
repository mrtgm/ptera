import { honoWithHook } from "../../../lib/hono";
import { userRepository } from "../../users/infrastructure/repository";
import {
	successWithDataResponse,
	successWithPaginationResponse,
} from "../../../shared/schema/response";
import { createQuery } from "../application/queries";
import { gameRepository } from "../infrastructure/repository";
import { errorHandler } from "./error-handler";
import { gameRouteCongfigs } from "./routes";

const gameRoutes = honoWithHook();

const queries = createQuery({
	gameRepository,
	userRepository,
});

// const command = createCommand({
// 	gameRepository,
// });

gameRoutes.openapi(gameRouteCongfigs.getGame, async (c) => {
	const publicId = c.req.valid("param").publicId;
	const result = await queries.executeGetGame(publicId);
	return successWithDataResponse(c, result);
});

gameRoutes.openapi(gameRouteCongfigs.getAsset, async (c) => {
	const publicId = c.req.valid("param").publicId;
	const result = await queries.executeGetAsset(publicId);
	return successWithDataResponse(c, result);
});

gameRoutes.openapi(gameRouteCongfigs.getGames, async (c) => {
	const query = c.req.valid("query");
	const result = await queries.executeSearch(query);
	return successWithPaginationResponse(c, result);
});

gameRoutes.onError(errorHandler);

export { gameRoutes };
