import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ENV } from "../../../../configs/env";
import * as schema from "./schema";

const connectionString = `postgres://${ENV.DATABASE_USER}:${ENV.DATABASE_PASSWORD}@${ENV.DATABASE_HOST}:${ENV.DATABASE_PORT}/${ENV.DATABASE_NAME}`;

export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
