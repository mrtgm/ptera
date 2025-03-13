import { z } from "zod";

export const userResponseSchema = z.object({
	id: z.number(),
	publicId: z.string(),
	jwtSub: z.string(),
	name: z.string(),
	bio: z.string().optional().nullable(),
	avatarUrl: z.string().optional().nullable(),
});
export type UserResponse = z.infer<typeof userResponseSchema>;

export const updateProfileRequestSchema = z.object({
	name: z.string().min(1).max(50),
	bio: z.string().max(500).optional().default(""),
	avatarUrl: z.string().url().optional().default(""),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
