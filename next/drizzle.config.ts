import { ENV } from "@ptera/config";
import { defineConfig } from "drizzle-kit";

const connectionString = `postgresql://${ENV.DATABASE_USER}:${ENV.DATABASE_PASSWORD}@${ENV.DATABASE_HOST}:${ENV.DATABASE_PORT}/${ENV.DATABASE_NAME}`;

export default defineConfig({
	schema: "./src/server/shared/infrastructure/db/schema.ts",
	out: "./src/server/shared/infrastructure/db",
	dialect: "postgresql",
	dbCredentials: {
		url: connectionString,
	},
});
