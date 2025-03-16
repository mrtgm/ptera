import {
	asset,
	character,
	characterAsset,
	characterGame,
} from "@/server/shared/infrastructure/db/schema";
import { and, eq, sql } from "drizzle-orm";
import {
	AssetNotFoundError,
	CharacterNotFoundError,
} from "~/schemas/assets/domain/error";
import type {
	Character,
	CharacterImage,
} from "~/schemas/assets/domain/resoucres";
import { AssetRepository } from "./asset";
import { BaseRepository, type Transaction } from "./base";

export class CharacterRepository extends BaseRepository {
	async createCharacter({
		params,
		tx,
	}: {
		params: {
			name: string;
			userId: number;
		};
		tx?: Transaction;
	}): Promise<Character> {
		return await this.executeTransaction(async (txLocal) => {
			const characterData = await txLocal
				.insert(character)
				.values({
					name: params.name,
					ownerId: params.userId,
					isPublic: false,
				})
				.returning()
				.execute();

			const characterWithEmptyAssets = {
				...characterData[0],
				images: {},
			};
			return characterWithEmptyAssets;
		}, tx);
	}

	async updateCharacter({
		params,
		tx,
	}: {
		params: {
			characterId: number;
			name: string | null | undefined;
		};
		tx?: Transaction;
	}): Promise<Character> {
		return await this.executeTransaction(async (txLocal) => {
			const characterToUpdate = await this.getCharacterById(
				params.characterId,
				txLocal,
			);

			if (!characterToUpdate) {
				throw new CharacterNotFoundError(params.characterId);
			}

			const updateFields: Record<string, unknown> = {};
			if (params.name) updateFields.name = params.name;

			if (Object.keys(updateFields).length === 0) {
				return characterToUpdate;
			}

			await txLocal
				.update(character)
				.set({
					...updateFields,
					updatedAt: sql`NOW()`,
				})
				.where(eq(character.id, characterToUpdate.id))
				.returning()
				.execute();

			return await this.getCharacterDetails(params.characterId, txLocal);
		}, tx);
	}

	async deleteCharacter({
		params,
		tx,
	}: {
		params: {
			characterId: number;
		};
		tx?: Transaction;
	}): Promise<{ success: boolean }> {
		return await this.executeTransaction(async (txLocal) => {
			const characterToDelete = await this.getCharacterById(
				params.characterId,
				txLocal,
			);
			if (!characterToDelete) {
				throw new CharacterNotFoundError(params.characterId);
			}

			// 関連付けを削除
			await txLocal
				.delete(characterGame)
				.where(eq(characterGame.characterId, characterToDelete.id))
				.execute();

			await txLocal
				.delete(characterAsset)
				.where(eq(characterAsset.characterId, characterToDelete.id))
				.execute();

			// キャラクター自体を削除
			await txLocal
				.delete(character)
				.where(eq(character.id, characterToDelete.id))
				.execute();

			return { success: true };
		}, tx);
	}

	// キャラクターにアセットを関連付ける
	async linkAssetToCharacter({
		params,
		tx,
	}: {
		params: {
			characterId: number;
			assetId: number;
		};
		tx?: Transaction;
	}): Promise<{ success: boolean }> {
		return await this.executeTransaction(async (txLocal) => {
			const characterToUpdate = await this.getCharacterById(
				params.characterId,
				txLocal,
			);
			if (!characterToUpdate) {
				throw new CharacterNotFoundError(params.characterId);
			}

			const assetRepository = new AssetRepository();
			const assetToLink = await assetRepository.getAssetById(
				params.assetId,
				txLocal,
			);
			if (!assetToLink) {
				throw new AssetNotFoundError(params.assetId);
			}

			// 既に関連付けが存在するか確認
			const existingLink = await txLocal
				.select()
				.from(characterAsset)
				.where(
					and(
						eq(characterAsset.characterId, characterToUpdate.id),
						eq(characterAsset.assetId, assetToLink.id),
					),
				)
				.limit(1)
				.execute();

			if (existingLink.length === 0) {
				// 関連付けが存在しない場合のみ作成
				await txLocal
					.insert(characterAsset)
					.values({
						characterId: characterToUpdate.id,
						assetId: assetToLink.id,
					})
					.execute();
			}

			return { success: true };
		}, tx);
	}

	async unlinkAssetFromCharacter({
		params,
		tx,
	}: {
		params: {
			characterId: number;
			assetId: number;
		};
		tx?: Transaction;
	}): Promise<{ success: boolean }> {
		return await this.executeTransaction(async (txLocal) => {
			const characterToUpdate = await this.getCharacterById(
				params.characterId,
				txLocal,
			);
			if (!characterToUpdate) {
				throw new CharacterNotFoundError(params.characterId);
			}

			const assetRepository = new AssetRepository();
			const assetToUnlink = await assetRepository.getAssetById(
				params.assetId,
				txLocal,
			);
			if (!assetToUnlink) {
				throw new AssetNotFoundError(params.assetId);
			}

			// 関連付けを削除
			await txLocal
				.delete(characterAsset)
				.where(
					and(
						eq(characterAsset.characterId, characterToUpdate.id),
						eq(characterAsset.assetId, assetToUnlink.id),
					),
				)
				.execute();

			return { success: true };
		}, tx);
	}

	async getCharacterById(
		characterId: number,
		tx?: Transaction,
	): Promise<Character | null> {
		const dbToUse = tx || this.db;
		const characterData = await dbToUse
			.select()
			.from(character)
			.where(eq(character.id, characterId))
			.limit(1)
			.execute();

		return characterData.length > 0
			? { ...characterData[0], images: {} }
			: null;
	}

	async getCharacterDetails(
		characterId: number,
		tx?: Transaction,
	): Promise<Character> {
		return await this.executeTransaction(async (txLocal) => {
			const characterData = await this.getCharacterById(characterId, txLocal);

			if (!characterData) {
				throw new CharacterNotFoundError(characterId);
			}

			const images = await txLocal
				.select({
					asset,
				})
				.from(characterAsset)
				.innerJoin(asset, eq(characterAsset.assetId, asset.id))
				.where(eq(characterAsset.characterId, characterData.id))
				.execute()
				.then((results) =>
					results.reduce(
						(acc, cur) => {
							acc[cur.asset.id] = {
								id: cur.asset.id,
								name: cur.asset.name,
								assetType: "characterImage",
								ownerId: cur.asset.ownerId as number,
								isPublic: cur.asset.isPublic,
								url: cur.asset.url,
								metadata: cur.asset.metadata as Record<string, unknown>,
							};
							return acc;
						},
						{} as Record<string, CharacterImage>,
					),
				);

			return {
				...characterData,
				images,
			};
		}, tx);
	}
}
