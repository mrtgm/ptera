import { db } from "@/server/shared/infrastructure/db";
import type * as schema from "@/server/shared/infrastructure/db/schema";
import { type ExtractTablesWithRelations, eq } from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { GameNotFoundError } from "../../../../../schemas/games/domain/error";

export type Transaction = PgTransaction<
	PostgresJsQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>;

export class BaseRepository {
	protected db = db;

	protected async executeTransaction<T>(
		fn: (tx: Transaction) => Promise<T>,
		providedTx?: Transaction,
	): Promise<T> {
		if (providedTx) {
			return await fn(providedTx);
		}

		return await this.db.transaction(async (tx) => {
			return await fn(tx);
		});
	}
}
