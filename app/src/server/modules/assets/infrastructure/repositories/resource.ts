import { eq, inArray, or } from "drizzle-orm";
import type {
	BGM,
	BackgroundImage,
	CGImage,
	Character,
	CharacterImage,
	GameResources,
	SoundEffect,
} from "~/schemas/assets/domain/resoucres";
import {
	asset,
	character,
	characterAsset,
} from "~/server/shared/infrastructure/db/schema";
import { BaseRepository } from "../../../games/infrastructure/repositories/base";

export class ResourceRepository extends BaseRepository {
	async getResource(userId: number): Promise<GameResources> {
		const characters = await this.db
			.select({
				id: character.id,
				name: character.name,
			})
			.from(character)
			.where(or(eq(character.ownerId, userId), eq(character.isPublic, true)))
			.execute();

		const characterAssets = await this.db
			.select({
				characterId: characterAsset.characterId,
				assetId: characterAsset.assetId,
				name: asset.name,
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
					name: cur.name,
					assetType: "characterImage",
					url: cur.url,
					metadata: cur.metadata as Record<string, unknown>,
				};
				return acc;
			},
			{} as Record<number, Record<string, CharacterImage>>,
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
				type: asset.assetType,
				name: asset.name,
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
				acc[cur.id] = { ...cur, assetType: "bgm" };
				return acc;
			},
			{} as Record<string, BGM>,
		);

		const soundEffectsMap = soundEffects.reduce(
			(acc, cur) => {
				acc[cur.id] = { ...cur, assetType: "soundEffect" };
				return acc;
			},
			{} as Record<string, SoundEffect>,
		);

		const backgroundImagesMap = backgroundImages.reduce(
			(acc, cur) => {
				acc[cur.id] = { ...cur, assetType: "backgroundImage" };
				return acc;
			},
			{} as Record<string, BackgroundImage>,
		);

		const cgImagesMap = cgImages.reduce(
			(acc, cur) => {
				acc[cur.id] = { ...cur, assetType: "cgImage" };
				return acc;
			},
			{} as Record<string, CGImage>,
		);

		return {
			character: charactersMap,
			bgm: bgmsMap,
			soundEffect: soundEffectsMap,
			backgroundImage: backgroundImagesMap,
			cgImage: cgImagesMap,
		};
	}
}
