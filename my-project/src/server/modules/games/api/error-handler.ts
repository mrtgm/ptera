import type { ErrorHandler, MiddlewareHandler } from "hono";
import type { Env } from "../../../lib/context";
import { errorResponse } from "../../../shared/schema/response";
import {
	GameNotFoundError,
	InitialSceneNotFoundError,
	ScenesNotFoundError,
	UserNotFoundError,
} from "../domain/error";

export const errorHandler: ErrorHandler<Env> = async (err, c) => {
	console.error(err);

	if (err instanceof GameNotFoundError) {
		return errorResponse(c, 404, "notFound", "warn", "game", { err });
	}

	if (err instanceof InitialSceneNotFoundError) {
		return errorResponse(c, 500, "internalServerError", "warn", "scene", {
			err,
		});
	}

	if (err instanceof ScenesNotFoundError) {
		return errorResponse(c, 500, "internalServerError", "warn", "scene", {
			err,
		});
	}

	if (err instanceof UserNotFoundError) {
		return errorResponse(c, 500, "internalServerError", "error", "user", {
			err,
		});
	}

	return errorResponse(c, 500, "internalServerError", "error", undefined, {
		err,
	});
};
