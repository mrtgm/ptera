import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/configs/env";

export default defineConfig({
	schema: "./drizzle/schema.ts",
	out: "./src/shared/infrastructure/",
	dialect: "postgresql",
	dbCredentials: {
		url: ENV.DATABASE_URL,
	},
});
