import { createEnv } from "@t3-oss/env-core";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: "../../.env" });



// DATAVASE_HOST=aws-0-ap-southeast-1.pooler.supabase.com
// DATABASE_PORT=5432
// DATABASE_NAME=postgres
// DATABASE_USER=postgres.fspleaulsqbptvvsksch
// DATABASE_PASSWORD=uVg5FT9_e!AgG-9

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
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
