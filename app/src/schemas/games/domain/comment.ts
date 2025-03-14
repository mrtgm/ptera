import type { User } from "@/schemas/users/domain/user";
import { z } from "zod";
import type { Game } from "./game";

export const commentSchema = z.object({
	id: z.number(),
	userId: z.number(),
	username: z.string(),
	avatarUrl: z.string().nullable().optional(),
	gameId: z.number(),
	content: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type Comment = z.infer<typeof commentSchema>;

export const createComment = ({
	game,
	commentText,
	currentUser,
}: {
	game: Game;
	commentText: string;
	currentUser: {
		id: number;
		name: string;
		avatarUrl?: string | null | undefined;
	} | null;
}): Comment => {
	return {
		id: 0,
		username: currentUser?.name || "ユーザー",
		userId: currentUser?.id || 0,
		avatarUrl: currentUser?.avatarUrl || "",
		content: commentText,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		gameId: game?.id || 0,
	};
};
