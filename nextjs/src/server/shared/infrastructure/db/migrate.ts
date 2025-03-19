import { ENV } from "@ptera/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = `postgresql://${ENV.DATABASE_USER}:${ENV.DATABASE_PASSWORD}@${ENV.DATABASE_HOST}:${ENV.DATABASE_PORT}/${ENV.DATABASE_NAME}`;

const migrationClient = postgres(connectionString, { max: 1 });

export const performMigration = async () => {
  try {
    const db = drizzle(migrationClient);

    console.log("Starting migration...",__dirname);

    await migrate(db, { migrationsFolder: `${__dirname}` });

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await migrationClient.end();
  }
};

performMigration();
