import { UserNotFoundError } from "@/server/modules/users/domain/error";
import { userRepository } from "@/server/modules/users/infrastructure/repository";
import {
	comment,
	user,
	userProfile,
} from "@/server/shared/infrastructure/db/schema";
import { count, eq } from "drizzle-orm";
import type { GetCommentsRequest } from "../../api/validator";
import type { Comment } from "../../domain/comment";
import { CommentNotFoundError } from "../../domain/error";
import { BaseRepository, type Transaction } from "./base";

export class CommentRepository extends BaseRepository {
	async getCommentByPublicId(publicId: string): Promise<Comment | null> {
		const commentData = await this.db
			.select({
				id: comment.id,
				publicId: comment.publicId,
				content: comment.content,
				userId: comment.userId,
				gameId: comment.gameId,
				userPublicId: user.publicId,
				username: userProfile.name,
				avatarUrl: userProfile.avatarUrl,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
			})
			.from(comment)
			.innerJoin(user, eq(comment.userId, user.id))
			.innerJoin(userProfile, eq(user.id, userProfile.userId))
			.where(eq(comment.publicId, publicId))
			.limit(1)
			.execute();

		if (commentData.length === 0) {
			throw new CommentNotFoundError(publicId);
		}

		return commentData[0];
	}

	async getComments(
		publicId: string,
		filter: GetCommentsRequest,
	): Promise<{ items: Comment[]; total: number }> {
		const gameId = await this.getGameIdFromPublicId(publicId);

		const commentsQuery = this.db
			.select({
				id: comment.id,
				publicId: comment.publicId,
				content: comment.content,
				userId: comment.userId,
				gameId: comment.gameId,
				userPublicId: user.publicId,
				username: userProfile.name,
				avatarUrl: userProfile.avatarUrl,
				createdAt: comment.createdAt,
				updatedAt: comment.updatedAt,
			})
			.from(comment)
			.innerJoin(user, eq(comment.userId, user.id))
			.innerJoin(userProfile, eq(user.id, userProfile.userId))
			.where(eq(comment.gameId, gameId));

		const [{ count: total }] = await this.db
			.select({ count: count() })
			.from(commentsQuery.as("comments_count"));

		const items = await commentsQuery
			.limit(Number(filter.limit || 20))
			.offset(Number(filter.offset || 0))
			.execute();

		return {
			items,
			total: Number(total),
		};
	}

	async createComment({
		params,
		tx,
	}: {
		params: {
			gamePublicId: string;
			userPublicId: string;
			content: string;
		};
		tx: Transaction;
	}): Promise<Comment> {
		return await this.executeTransaction(async (txLocal) => {
			const gameId = await this.getGameIdFromPublicId(
				params.gamePublicId,
				txLocal,
			);

			const user = await userRepository.getByPublicId(params.userPublicId);

			if (!user) {
				throw new UserNotFoundError(params.userPublicId);
			}

			const commentData = await this.db
				.insert(comment)
				.values({
					userId: user.id,
					gameId,
					content: params.content,
				})
				.returning()
				.execute();

			return {
				...commentData[0],
				userPublicId: user.publicId,
				username: user.name,
				avatarUrl: user.avatarUrl,
			};
		});
	}

	async deleteComment({
		params: { commentPublicId },
		tx,
	}: {
		params: { commentPublicId: string };
		tx?: Transaction;
	}): Promise<void> {
		return await this.executeTransaction(async (txLocal) => {
			const commentData = await txLocal
				.select()
				.from(comment)
				.where(eq(comment.publicId, commentPublicId))
				.limit(1)
				.execute();

			if (commentData.length === 0) {
				throw new CommentNotFoundError(commentPublicId);
			}

			const commentId = commentData[0].id;
			await txLocal.delete(comment).where(eq(comment.id, commentId)).execute();

			return;
		}, tx);
	}
}
