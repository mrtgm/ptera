import { sentry } from "@hono/sentry";
import type { MiddlewareHandler } from "hono";
import { nanoid } from "nanoid";
import { pino } from "pino";
import pretty from "pino-pretty";

const isDevelopment = process.env.NODE_ENV !== "production";

const prettyPrint = pretty({
	colorize: true,
});

export const log = pino(
	{
		level: "info",
	},
	isDevelopment ? prettyPrint : undefined,
);

type PrintFunc = (str: string) => void;

export enum LogPrefix {
	Outgoing = "res",
	Incoming = "req",
	Error = "err",
}

export const logger = (fn: PrintFunc = console.info): MiddlewareHandler => {
	return async function logger(c, next) {
		const { method } = c.req;

		const requestId = nanoid();
		c.set("requestId", requestId);

		const stripUrl = c.req.raw.url
			.replace(/(https?:\/\/)?([^\/]+)/, "")
			.slice(0, 150);

		const headers = { ...c.req.header() };

		const importantHeaders = {
			"content-type": headers["content-type"],
			"user-agent": headers["user-agent"],
			accept: headers.accept,
			"accept-encoding": headers["accept-encoding"],
			host: headers.host,
			referer: headers.referer,
			"x-forwarded-for": headers["x-forwarded-for"],
		};

		log.info({
			requestId,
			prefix: LogPrefix.Incoming,
			method,
			url: stripUrl,
			headers: importantHeaders,
		});

		const start = Date.now();

		await next();

		const user = c.get("user")?.id || "na";

		const responseTime = Date.now() - start;

		if (c.res.status >= 400 || responseTime > 1000) {
			// エラーまたは遅いレスポンスのみ詳細ログを記録
			log.warn({
				requestId,
				prefix: LogPrefix.Error,
				method,
				url: stripUrl,
				status: c.res.status,
				latency: Date.now() - start,
				user,
			});
		} else {
			log.info({
				requestId,
				prefix: LogPrefix.Outgoing,
				method,
				url: stripUrl,
				status: c.res.status,
				latency: `${Date.now() - start}ms`,
				user,
			});
		}
	};
};
