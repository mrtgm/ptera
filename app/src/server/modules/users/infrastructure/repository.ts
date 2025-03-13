import { db } from "@/server/shared/infrastructure/db";
import { user, userProfile } from "@/server/shared/infrastructure/db/schema";
import { eq, inArray } from "drizzle-orm";
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

	create(jwtSub: string, name: string): Promise<User>;
}

export const userRepository: UserRepository = {
	create: async (jwtSub: string, name: string) => {
		return await db.transaction(async (tx) => {
			const newUser = await tx.insert(user).values({ jwtSub }).returning({
				id: user.id,
				publicId: user.publicId,
				jwtSub: user.jwtSub,
			});
			if (!newUser[0]) {
				throw new Error("Failed to create user");
			}
			await tx.insert(userProfile).values({
				userId: newUser[0].id,
				name,
			});
			return {
				id: newUser[0].id,
				publicId: newUser[0].publicId,
				jwtSub: newUser[0].jwtSub,
				name,
				avatarUrl: "",
				bio: "",
				isDeleted: false,
			};
		});
	},

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
		return db.transaction(async (tx) => {
			const existingUser = await tx
				.select({ id: user.id })
				.from(user)
				.where(eq(user.id, id))
				.limit(1)
				.execute();

			if (existingUser.length === 0) {
				throw new Error(`User with id ${id} not found`);
			}

			await tx
				.update(userProfile)
				.set({ name, bio, avatarUrl })
				.where(eq(userProfile.userId, id))
				.execute();
		});
	},
};
