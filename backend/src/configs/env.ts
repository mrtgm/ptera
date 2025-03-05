import { env as dotenv } from "@dotenv-run/core";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

dotenv({
	root: "../../..",
	files: [".env"],
});

export const ENV = createEnv({
	server: {
		API_VERSION: z.string().default("v1"),
		BACKEND_PORT: z.string().default("8939"),
		DATABASE_URL: z.string().default(""),
		REDIS_URL: z.string().default(""),
		FRONTEND_URL: z.string().default(""),
		BACKEND_URL: z.string().default(""),
		AWS_COGNITO_USER_POOL_ID: z.string().default(""),
		AWS_COGNITO_CLIENT_ID: z.string().default(""),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
