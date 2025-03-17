import { UserNotFoundError, UserUnauthorizedError } from "@ptera/schema";
import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { errorResponse } from "../../../shared/schema/response";

export const errorHandler: ErrorHandler = (err, c) => {
	console.error(err);

	if (err instanceof HTTPException) {
		return err.getResponse();
	}

	if (err instanceof UserNotFoundError) {
		return errorResponse(c, 404, "notFound", "warn", "asset", {
			message: err.message,
		});
	}

	if (err instanceof UserUnauthorizedError) {
		return errorResponse(c, 403, "forbidden", "warn", "user", {
			message: err.message,
		});
	}

	return errorResponse(c, 500, "internalServerError", "error", "game", {
		err,
	});
};
