import type { createRoute } from "@hono/zod-openapi";
import type { Context } from "hono";
import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
} from "hono/utils/http-status";
import { z } from "zod";
import { log } from "~/core/middleware/logger";
import { type Env, getContextUser } from "~/lib/context";
import {
	type EntityType,
	entityTypeSchema,
} from "../infrastructure/db/drizzle";

type Responses = Parameters<typeof createRoute>[0]["responses"];

export const successWithoutDataSchema = z.object({ success: z.boolean() });
export const successWithDataSchema = <T extends z.ZodTypeAny>(schema: T) =>
	z.object({ success: z.boolean(), data: schema });
export const successWithPaginationSchema = <T extends z.ZodTypeAny>(
	schema: T,
) =>
	z.object({
		success: z.boolean(),
		data: z.object({
			items: schema.array(),
			total: z.number(),
		}),
	});

type SuccessWithoutData = z.infer<typeof successWithoutDataSchema>;
type SuccessWithData<T> = z.infer<ReturnType<typeof successWithDataSchema>>;
type SuccessWithPagination<T> = z.infer<
	ReturnType<typeof successWithPaginationSchema>
>;

export const successWithoutDataResponse = (ctx: Context<Env>, status = 200) => {
	return ctx.json({ success: true } as SuccessWithoutData, status as 200);
};

export const successWithDataResponse = <T>(
	ctx: Context,
	data: T,
	status = 200,
) => {
	return ctx.json({ success: true, data }, status as 200);
};

export const successWithPaginationResponse = <T>(
	c: Context,
	params: {
		items: T[];
		total: number;
	},
	status = 200,
) => {
	return c.json(
		{
			success: true,
			data: {
				items: params.items,
				total: params.total,
			},
		},
		status as 200,
	);
};

export type Severity = "info" | "warn" | "error";
export const errorSchema = z.object({
	message: z.string(),
	type: z.string(),
	status: z.number(),
	severity: z.string(),
	entityType: entityTypeSchema.optional(),
	requestId: z.string().optional(), // 一意なリクエスト ID
	path: z.string().optional(),
	method: z.string().optional(),
	timestamp: z.string().optional(),
	user: z.string().optional(),
	eventData: z.record(z.unknown()).optional(),
});

export type ErrorType = z.infer<typeof errorSchema>;

export const successWithErrorsSchema = () =>
	z.object({
		success: z.boolean(),
		errors: z.array(errorSchema),
	});

export const failWithErrorSchema = z.object({
	success: z.boolean().default(false),
	error: errorSchema,
});

export const errorResponses = {
	400: {
		description: "Bad request: problem processing request.",
		content: {
			"application/json": {
				schema: failWithErrorSchema,
			},
		},
	},
	401: {
		description: "Unauthorized: authentication required.",
		content: {
			"application/json": {
				schema: failWithErrorSchema,
			},
		},
	},
	403: {
		description: "Forbidden: insufficient permissions.",
		content: {
			"application/json": {
				schema: failWithErrorSchema,
			},
		},
	},
	404: {
		description: "Not found: resource does not exist.",
		content: {
			"application/json": {
				schema: failWithErrorSchema,
			},
		},
	},
	429: {
		description: "Rate limit: too many requests.",
		content: {
			"application/json": {
				schema: failWithErrorSchema,
			},
		},
	},
	500: {
		description: "Internal server error: unexpected error.",
		content: {
			"application/json": {
				schema: failWithErrorSchema,
			},
		},
	},
} satisfies Responses;

export type HttpErrorStatus = ClientErrorStatusCode | ServerErrorStatusCode;

export type EventData = Record<string, unknown>;

export type SimplifiedErrorKey =
	| "notFound"
	| "unauthorized"
	| "forbidden"
	| "badRequest"
	| "internalServerError"
	| "rateLimit"
	| "tokenNotValid"
	| "userNotFound"
	| "payloadTooLarge";

const getErrorMessage = (
	type: SimplifiedErrorKey,
	entityType?: EntityType,
): string => {
	switch (type) {
		case "notFound":
			return entityType
				? `指定された${entityType}が見つかりませんでした。`
				: "リソースが見つかりませんでした。";
		case "unauthorized":
			return "この操作を行うには認証が必要です。ログインしてください。";
		case "forbidden":
			return "この操作を実行する権限がありません。";
		case "badRequest":
			return "無効なリクエストです。入力内容を確認してください。";
		case "internalServerError":
			return "サーバー内部でエラーが発生しました。しばらく経ってからもう一度お試しください。";
		case "rateLimit":
			return "リクエスト数の上限に達しました。しばらく経ってからもう一度お試しください。";
		case "tokenNotValid":
			return "認証トークンが無効です。再度ログインしてください。";
		case "userNotFound":
			return "指定されたユーザーが見つかりませんでした。";
		case "payloadTooLarge":
			return "リクエストのサイズが大きすぎます。";
		default:
			return "不明なエラーが発生しました。";
	}
};

export const createError = (
	ctx: Context,
	status: HttpErrorStatus,
	type: SimplifiedErrorKey,
	severity: Severity = "info",
	entityType?: EntityType,
	eventData?: EventData,
	err?: Error,
) => {
	const message = getErrorMessage(type, entityType);
	const user = getContextUser();
	const error: ErrorType = {
		message,
		type: type,
		status,
		severity,
		requestId: ctx.get("requestId"),
		path: ctx.req.path,
		method: ctx.req.method,
		entityType,
		user: user?.publicId.toString(),
		eventData,
	};

	if (err || ["warn", "error"].includes(severity)) {
		log.error({
			...error,
			eventData,
		});

		console.error(err);
	}

	return error;
};

export const errorResponse = (
	ctx: Context,
	status: HttpErrorStatus,
	type: SimplifiedErrorKey,
	severity: Severity = "info",
	entityType?: EntityType,
	eventData?: EventData,
	err?: Error,
) => {
	const error: ErrorType = createError(
		ctx,
		status,
		type,
		severity,
		entityType,
		eventData,
		err,
	);

	return ctx.json({ success: false, error }, status as 500);
};
