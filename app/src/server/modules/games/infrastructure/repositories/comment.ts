import type { GetCommentsRequest } from "@/schemas/games/dto";
import { UserNotFoundError } from "@/schemas/users/domain/error";
import { userRepository } from "@/server/modules/users/infrastructure/repository";
import {
	comment,
	user,
	userProfile,
} from "@/server/shared/infrastructure/db/schema";
import { count, eq } from "drizzle-orm";
import type { Comment } from "../../../../../schemas/games/domain/comment";
import { CommentNotFoundError } from "../../../../../schemas/games/domain/error";
import { BaseRepository, type Transaction } from "./base";

export class CommentRepository extends BaseRepository {
	async getCommentById(commentId: number): Promise<Comment | null> {
		const commentData = await this.db
			.select({
				id: comment.id,
				content: comment.content,
				userId: comment.userId,
				gameId: comment.gameId,
				username: userProfile.name,
				avatarUrl: userProfile.avatarUrl,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
			})
			.from(comment)
			.innerJoin(user, eq(comment.userId, user.id))
			.innerJoin(userProfile, eq(user.id, userProfile.userId))
			.where(eq(comment.id, commentId))
			.limit(1)
			.execute();

		if (commentData.length === 0) {
			throw new CommentNotFoundError(commentId);
		}

		return commentData[0];
	}

	async getComments(gameId: number): Promise<Comment[]> {
		const comments = await this.db
			.select({
				id: comment.id,
				content: comment.content,
				userId: comment.userId,
				gameId: comment.gameId,
				username: userProfile.name,
				avatarUrl: userProfile.avatarUrl,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
			})
			.from(comment)
			.innerJoin(user, eq(comment.userId, user.id))
			.innerJoin(userProfile, eq(user.id, userProfile.userId))
			.where(eq(comment.gameId, gameId))
			.execute();

		return comments;
	}

	async createComment({
		params: { gameId, userId, content },
		tx,
	}: {
		params: {
			gameId: number;
			userId: number;
			content: string;
		};
		tx: Transaction;
	}): Promise<Comment> {
		return await this.executeTransaction(async (txLocal) => {
			const user = await userRepository.getById(userId, txLocal);

			if (!user) {
				throw new UserNotFoundError(userId);
			}

			const commentData = await this.db
				.insert(comment)
				.values({
					userId: user.id,
					gameId,
					content: content,
				})
				.returning()
				.execute();

			return {
				...commentData[0],
				userId: user.id,
				username: user.name,
				avatarUrl: user.avatarUrl,
			};
		}, tx);
	}

	async deleteComment({
		params: { commentId },
		tx,
	}: {
		params: { commentId: number };
		tx?: Transaction;
	}): Promise<void> {
		return await this.executeTransaction(async (txLocal) => {
			const commentData = await txLocal
				.select()
				.from(comment)
				.where(eq(comment.id, commentId))
				.limit(1)
				.execute();

			if (commentData.length === 0) {
				throw new CommentNotFoundError(commentId);
			}

			await txLocal.delete(comment).where(eq(comment.id, commentId)).execute();

			return;
		}, tx);
	}
}
