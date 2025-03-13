import { db } from "@/server/shared/infrastructure/db";
import {
	asset,
	assetGame,
	characterAsset,
} from "@/server/shared/infrastructure/db/schema";
import { eq, sql } from "drizzle-orm";
import { AssetNotFoundError } from "../../domain/error";
import type { MediaAsset } from "../../domain/resoucres";
import { BaseRepository, type Transaction } from "./base";

export class AssetRepository extends BaseRepository {
	// アセットを作成
	async createAsset({
		params,
		tx,
	}: {
		params: {
			name: string;
			assetType: string;
			url: string;
			metadata?: Record<string, Record<string, unknown>>;
			userId: number;
		};
		tx?: Transaction;
	}): Promise<MediaAsset> {
		return await this.executeTransaction(async (txLocal) => {
			const assetData = await txLocal
				.insert(asset)
				.values({
					name: params.name,
					assetType: params.assetType,
					url: params.url,
					metadata: params.metadata || {},
					ownerId: params.userId,
					isPublic: false,
				})
				.returning()
				.execute();

			return assetData[0] as MediaAsset;
		}, tx);
	}

	async updateAsset({
		params,
		tx,
	}: {
		params: {
			assetId: string;
			name?: string;
			metadata?: Record<string, unknown>;
		};
		tx?: Transaction;
	}): Promise<MediaAsset> {
		return await this.executeTransaction(async (txLocal) => {
			const assetToUpdate = await this.getAssetByPublicId(
				params.assetId,
				txLocal,
			);
			if (!assetToUpdate) {
				throw new AssetNotFoundError(params.assetId);
			}

			const updateFields: Record<string, unknown> = {};
			if (params.name) {
				updateFields.name = params.name;
			}
			if (params.metadata) {
				updateFields.metadata = params.metadata;
			}

			if (Object.keys(updateFields).length === 0) {
				return assetToUpdate;
			}

			const updatedAsset = await txLocal
				.update(asset)
				.set({
					...updateFields,
					updatedAt: sql`NOW()`,
				})
				.where(eq(asset.id, assetToUpdate.id))
				.returning()
				.execute();

			return updatedAsset[0] as MediaAsset;
		}, tx);
	}

	async deleteAsset({
		params,
		tx,
	}: {
		params: {
			assetId: string;
		};
		tx?: Transaction;
	}): Promise<{ success: boolean }> {
		return await this.executeTransaction(async (txLocal) => {
			const assetToDelete = await this.getAssetByPublicId(
				params.assetId,
				txLocal,
			);
			if (!assetToDelete) {
				throw new AssetNotFoundError(params.assetId);
			}

			// 関連付けを削除
			await txLocal
				.delete(assetGame)
				.where(eq(assetGame.assetId, assetToDelete.id))
				.execute();

			await txLocal
				.delete(characterAsset)
				.where(eq(characterAsset.assetId, assetToDelete.id))
				.execute();

			// アセット自体を削除
			await txLocal
				.delete(asset)
				.where(eq(asset.id, assetToDelete.id))
				.execute();

			return { success: true };
		}, tx);
	}

	async getAssetByPublicId(
		assetId: string,
		tx?: Transaction,
	): Promise<MediaAsset | null> {
		const dbToUse = tx || this.db;
		const assetData = await dbToUse
			.select()
			.from(asset)
			.where(eq(asset.publicId, assetId))
			.limit(1)
			.execute();

		if (assetData.length === 0) {
			throw new AssetNotFoundError(assetId);
		}
		return assetData[0] as MediaAsset;
	}

	async getAssetById(id: number, tx?: Transaction): Promise<MediaAsset> {
		const dbToUse = tx || this.db;
		const assetData = await dbToUse
			.select()
			.from(asset)
			.where(eq(asset.id, id))
			.limit(1)
			.execute();

		if (assetData.length === 0) {
			throw new AssetNotFoundError(String(id));
		}

		return assetData[0] as MediaAsset;
	}
}
