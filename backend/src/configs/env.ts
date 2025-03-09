import { createEnv } from "@t3-oss/env-core";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

export const ENV = createEnv({
	server: {
		API_VERSION: z.string().default("v1"),
		DOMAIN_NAME: z.string(),
		ENV: z.string(),
		PORT: z.string(),

		DB_NAME: z.string(),
		CLUSTER_ARN: z.string(),
		SECRET_ARN: z.string(),
		DATABASE_URL: z.string().default(""),

		OIDC_AUTH_SECRET: z.string(),
		OIDC_ISSUER: z.string(),
		OIDC_CLIENT_ID: z.string(),
		OIDC_CLIENT_SECRET: z.string(),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
