import { z } from "zod";
import { paginationRequestSchema } from "~/shared/schema/request";

export const getGamesRequstSchema = paginationRequestSchema.merge(
	z.object({
		sort: z
			.enum(["createdAt", "likeCount", "playCount"])
			.default("createdAt")
			.optional(),
	}),
);

export type GetGamesRequest = z.infer<typeof getGamesRequstSchema>;
