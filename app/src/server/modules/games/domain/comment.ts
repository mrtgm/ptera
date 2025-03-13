import { z } from "zod";

export const commentSchema = z.object({
	id: z.number(),
	publicId: z.string(),
	userPublicId: z.string(),
	username: z.string(),
	avatarUrl: z.string().nullable().optional(),
	gameId: z.number(),
	content: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type Comment = z.infer<typeof commentSchema>;
