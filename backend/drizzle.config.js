import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/configs/env";

export default defineConfig({
	schema: "./src/shared/infrastructure/db/schema.ts",
	out: "./src/shared/infrastructure/db/",
	dialect: "postgresql",
	dbCredentials: {
		url: ENV.DATABASE_URL,
	},
});
