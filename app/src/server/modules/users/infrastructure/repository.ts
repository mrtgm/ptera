import { db } from "@/server/shared/infrastructure/db";
import { user, userProfile } from "@/server/shared/infrastructure/db/schema";
import { eq, inArray } from "drizzle-orm";
import { UserNotFoundError } from "../../../../schemas/users/domain/error";
import type { User } from "../../../../schemas/users/domain/user";
import type { Transaction } from "../../games/infrastructure/repositories/base";

export interface UserRepository {
	getById(id: number, tx?: Transaction): Promise<User | null>;
	getUsersByIds(userIds: number[]): Promise<Record<number, User>>;
	getByJwtSub(jwtSub: string): Promise<User | null>;

	updateUserProfile(
		id: number,
		name: string,
		bio: string | null | undefined,
		avatarUrl: string | null | undefined,
	): Promise<void>;

	create(jwtSub: string, name: string): Promise<User>;
}

export const userRepository: UserRepository = {
	create: async (jwtSub: string, name: string) => {
		return await db.transaction(async (tx) => {
			const newUser = await tx.insert(user).values({ jwtSub }).returning({
				id: user.id,
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
				jwtSub: newUser[0].jwtSub,
				name,
				avatarUrl: "",
				bio: "",
				isDeleted: false,
			};
		});
	},

	getById: async (id: number, tx?: Transaction) => {
		return (tx || db)
			.select({
				id: user.id,
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

	getByJwtSub: async (jwtSub: string) => {
		return db
			.select({
				id: user.id,
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
		bio: string | null | undefined,
		avatarUrl: string | null | undefined,
	) => {
		return db.transaction(async (tx) => {
			const existingUser = await tx
				.select({ id: user.id })
				.from(user)
				.where(eq(user.id, id))
				.limit(1)
				.execute();

			if (existingUser.length === 0) {
				throw new UserNotFoundError(id);
			}

			// 更新するフィールドを準備
			const updateFields: Record<string, unknown> = {};
			if (name) {
				updateFields.name = name;
			}
			if (bio !== undefined) {
				updateFields.bio = bio;
			}
			if (avatarUrl !== undefined) {
				updateFields.avatarUrl = avatarUrl;
			}

			// 更新
			if (Object.keys(updateFields).length === 0) {
				return;
			}

			await tx
				.update(userProfile)
				.set({ name, bio, avatarUrl })
				.where(eq(userProfile.userId, id))
				.execute();
		});
	},
};
