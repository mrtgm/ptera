import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { omit } from "remeda";
import type { game, scene } from "~/shared/infrastructure/db/schema";
import type { GameResponseDto } from "../application/dto";
import { type Game, checkStatus } from "../domain/entities";

export type GameRowSelect = InferSelectModel<typeof game>;
export type GameRowInsert = InferInsertModel<typeof game>;

export function mapGameToDomain(row: GameRowSelect): Game {
	return {
		...row,
		status: checkStatus(row.status) ? row.status : "draft",
	};
}

export function mapGameToPersistence(
	game: Game,
): Omit<GameRowInsert, "createdAt" | "updatedAt"> {
	return game;
}

export type SceneRawSelect = InferSelectModel<typeof scene>;
export type SceneRawInsert = InferInsertModel<typeof scene>;
