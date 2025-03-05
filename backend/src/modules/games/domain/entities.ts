import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { game } from "~/shared/infrastructure/db/schema";

export const gameStatusSchema = z.enum(["draft", "published", "archived"]);

export type GameStatus = z.infer<typeof gameStatusSchema>;

export type Game = {
	id: number;
	publicId: string;
	description: string | null;
	status: "draft" | "published" | "archived";
	name: string;
	userId: number;
	coverImageUrl: string | null;
	releaseDate: string | null;
	createdAt: string;
	updatedAt: string;
};

export const checkStatus = (status: string): status is GameStatus => {
	const result = gameStatusSchema.safeParse(status);
	return result.success;
};

const canPublishGame = (game: Game): boolean => {
	return game.status === "draft";
};

const publishGame = (game: Game): Game => {
	if (!canPublishGame(game)) {
		throw new Error("ゲームを公開できません");
	}

	return {
		...game,
		status: "published",
	};
};

const canArchiveGame = (game: Game): boolean => {
	return game.status === "published";
};

const archiveGame = (game: Game): Game => {
	if (!canArchiveGame(game)) {
		throw new Error("ゲームをアーカイブできません");
	}

	return {
		...game,
		status: "archived",
	};
};
