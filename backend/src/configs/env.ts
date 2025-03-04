import { env as dotenv } from "@dotenv-run/core";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

dotenv({
	root: "../../..",
	files: [".env"],
});

export const ENV = createEnv({
	server: {
		PORT: z.string().default("8939"),
		DATABASE_URL: z.string().default(""),
		REDIS_URL: z.string().default(""),
		FRONTEND_URL: z.string().default(""),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
