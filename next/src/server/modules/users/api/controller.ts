import { honoWithHook } from "../../../lib/hono";
import {
	errorResponse,
	successWithDataResponse,
} from "../../../shared/schema/response";
import { FileUploadService } from "../../assets/infrastructure/file-upload";
import { GameRepository } from "../../games/infrastructure/repository";
import { createUserCommand } from "../application/commands";
import { createUserQuery } from "../application/queries";

import { userRepository } from "../infrastructure/repository";
import { errorHandler } from "./error-handler";
import { userRouteConfigs } from "./routes";

const gameRepostiory = new GameRepository();
const fileUploadService = new FileUploadService();

const userQuery = createUserQuery({
	userRepository,
	gameRepostiory,
});

const userCommand = createUserCommand({
	userRepository,
	fileUploadService,
});

const userRoutes = honoWithHook()
	.openapi(userRouteConfigs.getUser, async (c) => {
		const userId = c.req.valid("param").userId;
		const result = await userQuery.executeGetUser(userId);
		return successWithDataResponse(c, result);
	})
	.openapi(userRouteConfigs.getUserGames, async (c) => {
		const userId = c.req.valid("param").userId;
		const result = await userQuery.executeGetUserGames(userId);
		return successWithDataResponse(c, result);
	})
	.openapi(userRouteConfigs.updateUserProfile, async (c) => {
		const userId = c.req.valid("param").userId;
		const dto = c.req.valid("json");
		const currentUserId = c.get("user")?.id;

		if (!currentUserId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}

		const result = await userCommand.executeUpdateProfile(
			userId,
			dto,
			currentUserId,
		);
		return successWithDataResponse(c, result);
	})
	.openapi(userRouteConfigs.uploadUserAvatar, async (c) => {
		const userId = c.req.valid("param").userId;
		const formData = await c.req.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return errorResponse(c, 400, "badRequest", "error");
		}

		const currentUserId = c.get("user")?.id;

		if (!currentUserId) {
			return errorResponse(c, 401, "unauthorized", "error");
		}

		const result = await userCommand.executeUploadAvatar(
			userId,
			file,
			currentUserId,
		);

		return successWithDataResponse(c, result);
	});

userRoutes.onError(errorHandler);

export { userRoutes };
