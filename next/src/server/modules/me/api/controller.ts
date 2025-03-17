import { honoWithHook } from "@/server/lib/hono";
import {
  errorResponse,
  successWithDataResponse,
} from "@/server/shared/schema/response";
import { ResourceRepository } from "../../assets/infrastructure/repositories/resource";
import { GameRepository } from "../../games/infrastructure/repository";
import { userRepository } from "../../users/infrastructure/repository";
import { createDashboardQuery } from "../application/queries";
import { errorHandler } from "./error-handler";
import { dashboardRouteConfigs } from "./routes";

const gameRepository = new GameRepository();
const resourceRepository = new ResourceRepository();

const dashboardQuery = createDashboardQuery({
  userRepository,
  gameRepository,
  resourceRepository,
});

const dashboardRoutes = honoWithHook();

dashboardRoutes
  .openapi(dashboardRouteConfigs.getMyLikedGames, async (c) => {
    const currentUserId = c.get("user")?.id;

    if (!currentUserId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }
    const result = await dashboardQuery.executeGetMyLikedGames(currentUserId);
    return successWithDataResponse(c, result);
  })
  .openapi(dashboardRouteConfigs.getMyGames, async (c) => {
    const currentUserId = c.get("user")?.id;

    if (!currentUserId) {
      return errorResponse(c, 401, "unauthorized", "warn", "user", {
        userId: "required",
      });
    }

    const result = await dashboardQuery.executeGetMyGames(currentUserId);
    return successWithDataResponse(c, result);
  })
  .openapi(dashboardRouteConfigs.getMyResources, async (c) => {
    const currentUserId = c.get("user")?.id;

    if (!currentUserId) {
      return errorResponse(c, 401, "unauthorized", "error");
    }

    const result = await dashboardQuery.executeGetMyResources(currentUserId);
    return successWithDataResponse(c, result);
  });

dashboardRoutes.onError(errorHandler);

export { dashboardRoutes };
