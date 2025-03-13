import {
	asset,
	assetGame,
	character,
	characterAsset,
	characterGame,
	game,
} from "@/server/shared/infrastructure/db/schema";
import { and, eq, inArray, or } from "drizzle-orm";
import type {
	Character,
	GameResources,
	MediaAsset,
} from "../../domain/resoucres";
import { BaseRepository } from "./base";

export class ResourceRepository extends BaseRepository {
	async getResource(userId: number): Promise<GameResources> {
		const characters = await this.db
			.select({
				id: character.id,
				publicId: character.publicId,
				name: character.name,
			})
			.from(character)
			.where(or(eq(character.ownerId, userId), eq(character.isPublic, true)))
			.execute();

		const characterAssets = await this.db
			.select({
				characterId: characterAsset.characterId,
				assetId: characterAsset.assetId,
				publicId: asset.publicId,
				filename: asset.name,
				url: asset.url,
				metadata: asset.metadata,
			})
			.from(characterAsset)
			.innerJoin(asset, eq(characterAsset.assetId, asset.id))
			.where(
				inArray(
					characterAsset.characterId,
					characters.map((v) => v.id),
				),
			)
			.execute();

		const characterAssetsMap = characterAssets.reduce(
			(acc, cur) => {
				if (!acc[cur.characterId]) {
					acc[cur.characterId] = {};
				}
				acc[cur.characterId][cur.assetId] = {
					id: cur.assetId,
					publicId: cur.publicId,
					filename: cur.filename,
					url: cur.url,
					metadata: cur.metadata as Record<string, unknown>,
				};
				return acc;
			},
			{} as Record<number, Record<string, MediaAsset>>,
		);

		const charactersMap = characters
			.map((v) => ({
				...v,
				images: characterAssetsMap[v.id],
			}))
			.reduce(
				(acc, cur) => {
					acc[cur.id] = cur;
					return acc;
				},
				{} as Record<string, Character>,
			);

		const usedAssets = await this.db
			.select({
				id: asset.id,
				publicId: asset.publicId,
				type: asset.assetType,
				filename: asset.name,
				url: asset.url,
				metadata: asset.metadata,
			})
			.from(asset)
			.where(or(eq(asset.isPublic, true), eq(asset.ownerId, userId)))
			.execute();

		const bgms = usedAssets.filter((v) => v.type === "bgm");
		const soundEffects = usedAssets.filter((v) => v.type === "soundEffect");
		const backgroundImages = usedAssets.filter(
			(v) => v.type === "backgroundImage",
		);
		const cgImages = usedAssets.filter((v) => v.type === "cgImage");

		const bgmsMap = bgms.reduce(
			(acc, cur) => {
				acc[cur.id] = cur as MediaAsset;
				return acc;
			},
			{} as Record<string, MediaAsset>,
		);

		const soundEffectsMap = soundEffects.reduce(
			(acc, cur) => {
				acc[cur.id] = cur as MediaAsset;
				return acc;
			},
			{} as Record<string, MediaAsset>,
		);

		const backgroundImagesMap = backgroundImages.reduce(
			(acc, cur) => {
				acc[cur.id] = cur as MediaAsset;
				return acc;
			},
			{} as Record<string, MediaAsset>,
		);

		const cgImagesMap = cgImages.reduce(
			(acc, cur) => {
				acc[cur.id] = cur as MediaAsset;
				return acc;
			},
			{} as Record<string, MediaAsset>,
		);

		return {
			characters: charactersMap,
			bgms: bgmsMap,
			soundEffects: soundEffectsMap,
			backgroundImages: backgroundImagesMap,
			cgImages: cgImagesMap,
		};
	}
}
