import { ENV } from "~/configs/env";
import * as schema from "./schema";

import { drizzle } from "drizzle-orm/node-postgres";
export const db = drizzle({
	connection: ENV.DATABASE_URL,
	schema: schema,
});
