import { eq, inArray } from "drizzle-orm";
import { db } from "~/shared/infrastructure/db";
import { user, userProfile } from "~/shared/infrastructure/db/schema";
import type { User } from "../domain/entities";

export interface UserRepository {
	getById(id: number): Promise<User | null>;
	getUsersByIds(userIds: number[]): Promise<Record<number, User>>;
	getByPublicId(publicId: string): Promise<User | null>;
	getByJwtSub(jwtSub: string): Promise<User | null>;

	updateUserProfile(
		id: number,
		name: string,
		bio: string,
		avatarUrl: string,
	): Promise<void>;

	// createUser(
	// 	jwtSub: string,
	// 	name: string,
	// 	bio: string,
	// 	avatarUrl: string,
	// ): Promise<User>;
}

export const userRepository: UserRepository = {
	getById: async (id: number) => {
		return db
			.select({
				id: user.id,
				publicId: user.publicId,
				jwtSub: user.jwtSub,
				name: userProfile.name,
				bio: userProfile.bio,
				avatarUrl: userProfile.avatarUrl,
				isDeleted: user.isDeleted,
			})
			.from(user)
			.innerJoin(userProfile, eq(user.id, userProfile.userId))
			.where(eq(user.id, id))
			.limit(1)
			.execute()
			.then((rows) => {
				if (rows.length === 0) {
					return null;
				}
				return rows[0];
			});
	},

	getByPublicId: async (publicId: string) => {
		return db
			.select({
				id: user.id,
				publicId: user.publicId,
				name: userProfile.name,
				jwtSub: user.jwtSub,
				bio: userProfile.bio,
				avatarUrl: userProfile.avatarUrl,
				isDeleted: user.isDeleted,
			})
			.from(user)
			.innerJoin(userProfile, eq(user.id, userProfile.userId))
			.where(eq(user.publicId, publicId))
			.limit(1)
			.execute()
			.then((rows) => {
				if (rows.length === 0) {
					return null;
				}
				return rows[0];
			});
	},

	getByJwtSub: async (jwtSub: string) => {
		return db
			.select({
				id: user.id,
				publicId: user.publicId,
				jwtSub: user.jwtSub,
				name: userProfile.name,
				bio: userProfile.bio,
				avatarUrl: userProfile.avatarUrl,
				isDeleted: user.isDeleted,
			})
			.from(user)
			.innerJoin(userProfile, eq(user.id, userProfile.userId))
			.where(eq(user.jwtSub, jwtSub))
			.limit(1)
			.execute()
			.then((rows) => {
				if (rows.length === 0) {
					return null;
				}
				return rows[0];
			});
	},

	getUsersByIds: async (userIds: number[]) => {
		const usersQuery = await db
			.select({
				id: user.id,
				publicId: user.publicId,
				name: userProfile.name,
				avatarUrl: userProfile.avatarUrl,
				bio: userProfile.bio,
				jwtSub: user.jwtSub,
				isDeleted: user.isDeleted,
			})
			.from(user)
			.leftJoin(userProfile, eq(user.id, userProfile.userId))
			.where(inArray(user.id, userIds))
			.execute();

		return usersQuery.reduce(
			(acc, u) => {
				acc[u.id] = {
					id: u.id,
					jwtSub: u.jwtSub,
					publicId: u.publicId,
					name: u.name || "",
					avatarUrl: u.avatarUrl,
					bio: u.bio || "",
					isDeleted: u.isDeleted,
				};
				return acc;
			},
			{} as Record<number, User>,
		);
	},

	updateUserProfile: async (
		id: number,
		name: string,
		bio: string,
		avatarUrl: string,
	) => {
		return db
			.update(userProfile)
			.set({ name, bio, avatarUrl })
			.where(eq(userProfile.userId, id))
			.execute()
			.then(() => {});
	},
};
