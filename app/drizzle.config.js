import { defineConfig } from "drizzle-kit";
import { ENV } from "./api/configs/env";

const connectionString = `postgresql://${ENV.DATABASE_USER}:${ENV.DATABASE_PASSWORD}@${ENV.DATABASE_HOST}:${ENV.DATABASE_PORT}/${ENV.DATABASE_NAME}`;

export default defineConfig({
	schema: "./src/shared/infrastructure/db/schema.ts",
	out: "./src/shared/infrastructure/db/",
	dialect: "postgresql",
	dbCredentials: {
		url: connectionString,
	},
});
