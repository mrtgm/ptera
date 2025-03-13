import { honoWithHook } from "../../../lib/hono";
import {
	errorResponse,
	successWithDataResponse,
} from "../../../shared/schema/response";
import { createUserCommand } from "../application/commands";
import { createUserQuery } from "../application/queries";

import { userRepository } from "../infrastructure/repository";
import { errorHandler } from "./error-handler";
import { userRouteConfigs } from "./routes";

const userRoutes = honoWithHook();

const userQuery = createUserQuery({
	userRepository,
});

const userCommand = createUserCommand({
	userRepository,
});

// ユーザー情報取得
userRoutes.openapi(userRouteConfigs.getUser, async (c) => {
	const userId = c.req.valid("param").userId;
	const result = await userQuery.executeGetUser(userId);
	return successWithDataResponse(c, result);
});

// ユーザープロフィール更新
userRoutes.openapi(userRouteConfigs.updateUserProfile, async (c) => {
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
});

userRoutes.onError(errorHandler);

export { userRoutes };
