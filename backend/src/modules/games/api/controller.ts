import type { Context } from "hono";
import type { Env } from "~/lib/context";
import { honoWithHook } from "~/lib/hono";
import { userRepository } from "~/modules/users/infrastructure/repository";
import { successWithPaginationResponse } from "~/shared/schema/response";
import { createQuery } from "../application/queries";
import { gameRepository } from "../infrastructure/repository";
import { gameRouteCongfigs } from "./routes";

const gameRoutes = honoWithHook();

const queries = createQuery({
	gameRepository,
	userRepository,
});

gameRoutes.openapi(gameRouteCongfigs.getGames, async (c) => {
	const query = c.req.valid("query");
	const result = await queries.executeSearch(query);
	return successWithPaginationResponse(c, result);
});

export { gameRoutes };
