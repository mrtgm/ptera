import { z } from "zod";
import { paginationRequestSchema } from "@/server/shared/schema/request";

export const getGamesRequstSchema = paginationRequestSchema.merge(
	z.object({
		sort: z
			.enum(["createdAt", "likeCount", "playCount"])
			.default("createdAt")
			.optional(),
		categoryId: z.union([z.number(), z.string().transform(Number)]).optional(),
	}),
);

export type GetGamesRequest = z.infer<typeof getGamesRequstSchema>;
