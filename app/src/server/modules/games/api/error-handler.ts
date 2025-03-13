import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { errorResponse } from "../../../shared/schema/response";
import { UserUnauthorizedError } from "../../users/domain/error";
import {
	CommentNotFoundError,
	EventNotFoundError,
	GameNotFoundError,
	InitialSceneCannotBeDeletedError,
	InitialSceneNotFoundError,
	LastEventCannotBeDeletedError,
	SceneNotFoundError,
	ScenesNotFoundError,
} from "../domain/error";

export const errorHandler: ErrorHandler = (err, c) => {
	console.error(err);

	if (err instanceof HTTPException) {
		return err.getResponse();
	}

	if (err instanceof GameNotFoundError) {
		return errorResponse(c, 404, "notFound", "warn", "game", {
			message: err.message,
		});
	}

	if (err instanceof SceneNotFoundError) {
		return errorResponse(c, 404, "notFound", "warn", "scene", {
			message: err.message,
		});
	}

	if (err instanceof EventNotFoundError) {
		return errorResponse(c, 404, "notFound", "warn", "event", {
			message: err.message,
		});
	}

	if (err instanceof InitialSceneNotFoundError) {
		return errorResponse(c, 404, "notFound", "warn", "scene", {
			message: err.message,
		});
	}

	if (err instanceof ScenesNotFoundError) {
		return errorResponse(c, 404, "notFound", "warn", "scene", {
			message: err.message,
		});
	}

	if (err instanceof CommentNotFoundError) {
		return errorResponse(c, 404, "notFound", "warn", "comment", {
			message: err.message,
		});
	}

	if (err instanceof UserUnauthorizedError) {
		return errorResponse(c, 403, "forbidden", "warn", "user", {
			message: err.message,
		});
	}

	if (
		err instanceof LastEventCannotBeDeletedError ||
		err instanceof InitialSceneCannotBeDeletedError
	) {
		return errorResponse(c, 400, "badRequest", "warn", "game", {
			message: err.message,
		});
	}

	return errorResponse(c, 500, "internalServerError", "error", "game", {
		err,
	});
};
