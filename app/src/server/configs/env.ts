import { createEnv } from "@t3-oss/env-nextjs";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../../.env" });

export const ENV = createEnv({
	server: {
		API_VERSION: z.string().default("v1"),
		DOMAIN_NAME: z.string(),
		ENV: z.string(),
		PORT: z.string().default("8000"),

		DATABASE_HOST: z.string(),
		DATABASE_PORT: z.string(),
		DATABASE_NAME: z.string(),
		DATABASE_USER: z.string(),
		DATABASE_PASSWORD: z.string(),

		OIDC_AUTH_SECRET: z.string(),
		OIDC_ISSUER: z.string(),
		OIDC_CLIENT_ID: z.string(),
		OIDC_CLIENT_SECRET: z.string(),
	},
	runtimeEnv: {
		API_VERSION: process.env.API_VERSION,
		DOMAIN_NAME: process.env.DOMAIN_NAME,
		ENV: process.env.ENV,
		PORT: process.env.PORT,

		DATABASE_HOST: process.env.DATABASE_HOST,
		DATABASE_PORT: process.env.DATABASE_PORT,
		DATABASE_NAME: process.env.DATABASE_NAME,
		DATABASE_USER: process.env.DATABASE_USER,
		DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,

		OIDC_AUTH_SECRET: process.env.OIDC_AUTH_SECRET,
		OIDC_ISSUER: process.env.OIDC_ISSUER,
		OIDC_CLIENT_ID: process.env.OIDC_CLIENT_ID,
		OIDC_CLIENT_SECRET: process.env.OIDC_CLIENT_SECRET,
	},
	emptyStringAsUndefined: true,
});
