/* ------------------------------------------------------
		User
------------------------------------------------------ */

import { z } from "zod";

export const userProfileSchema = z.object({
	name: z.string(),
	bio: z.string().nullable(),
	avatarUrl: z.string().nullable(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export const userSchema = z
	.object({
		id: z.number(),
		publicId: z.string(),
		jwtSub: z.string(),
		isDeleted: z.boolean(),
	})
	.merge(userProfileSchema);

export type User = z.infer<typeof userSchema>;
