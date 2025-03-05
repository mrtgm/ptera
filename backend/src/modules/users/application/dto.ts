import { z } from "zod";

export const userResponseDtoSchema = z.object({
	publicId: z.string(),
	name: z.string(),
	bio: z.string(),
	avatarUrl: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
