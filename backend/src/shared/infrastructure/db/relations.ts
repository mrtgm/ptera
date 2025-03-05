import { relations } from "drizzle-orm/relations";
import { user, userProfile, asset, character, characterAsset, game, gamePlay, gameInitialScene, scene, choiceScene, gotoScene, endScene, choice, comment, like, gameCategoryRelation, gameCategory, event, eventCategoryRelation, eventCategory, changeBackgroundEvent, appearCharacterEvent, hideCharacterEvent, hideAllCharactersEvent, moveCharacterEvent, characterEffectEvent, bgmStartEvent, bgmStopEvent, soundEffectEvent, appearCgEvent, hideCgEvent, textRenderEvent, appearMessageWindowEvent, hideMessageWindowEvent, effectEvent } from "./schema";

export const userProfileRelations = relations(userProfile, ({one}) => ({
	user: one(user, {
		fields: [userProfile.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	userProfiles: many(userProfile),
	assets: many(asset),
	characters: many(character),
	games: many(game),
	gamePlays: many(gamePlay),
	comments: many(comment),
	likes: many(like),
}));

export const assetRelations = relations(asset, ({one, many}) => ({
	user: one(user, {
		fields: [asset.ownerId],
		references: [user.id]
	}),
	characterAssets: many(characterAsset),
	changeBackgroundEvents: many(changeBackgroundEvent),
	appearCharacterEvents: many(appearCharacterEvent),
	bgmStartEvents: many(bgmStartEvent),
	soundEffectEvents: many(soundEffectEvent),
	appearCgEvents: many(appearCgEvent),
}));

export const characterRelations = relations(character, ({one, many}) => ({
	user: one(user, {
		fields: [character.ownerId],
		references: [user.id]
	}),
	characterAssets: many(characterAsset),
	appearCharacterEvents: many(appearCharacterEvent),
	hideCharacterEvents: many(hideCharacterEvent),
	moveCharacterEvents: many(moveCharacterEvent),
	characterEffectEvents: many(characterEffectEvent),
}));

export const characterAssetRelations = relations(characterAsset, ({one}) => ({
	character: one(character, {
		fields: [characterAsset.characterId],
		references: [character.id]
	}),
	asset: one(asset, {
		fields: [characterAsset.assetId],
		references: [asset.id]
	}),
}));

export const gameRelations = relations(game, ({one, many}) => ({
	user: one(user, {
		fields: [game.userId],
		references: [user.id]
	}),
	gamePlays: many(gamePlay),
	gameInitialScenes: many(gameInitialScene),
	scenes: many(scene),
	comments: many(comment),
	likes: many(like),
	gameCategoryRelations: many(gameCategoryRelation),
}));

export const gamePlayRelations = relations(gamePlay, ({one}) => ({
	game: one(game, {
		fields: [gamePlay.gameId],
		references: [game.id]
	}),
	user: one(user, {
		fields: [gamePlay.userId],
		references: [user.id]
	}),
}));

export const gameInitialSceneRelations = relations(gameInitialScene, ({one}) => ({
	game: one(game, {
		fields: [gameInitialScene.gameId],
		references: [game.id]
	}),
	scene: one(scene, {
		fields: [gameInitialScene.sceneId],
		references: [scene.id]
	}),
}));

export const sceneRelations = relations(scene, ({one, many}) => ({
	gameInitialScenes: many(gameInitialScene),
	game: one(game, {
		fields: [scene.gameId],
		references: [game.id]
	}),
	choiceScenes: many(choiceScene),
	gotoScenes_sceneId: many(gotoScene, {
		relationName: "gotoScene_sceneId_scene_id"
	}),
	gotoScenes_nextSceneId: many(gotoScene, {
		relationName: "gotoScene_nextSceneId_scene_id"
	}),
	endScenes: many(endScene),
	choices: many(choice),
	events: many(event),
}));

export const choiceSceneRelations = relations(choiceScene, ({one, many}) => ({
	scene: one(scene, {
		fields: [choiceScene.sceneId],
		references: [scene.id]
	}),
	choices: many(choice),
}));

export const gotoSceneRelations = relations(gotoScene, ({one}) => ({
	scene_sceneId: one(scene, {
		fields: [gotoScene.sceneId],
		references: [scene.id],
		relationName: "gotoScene_sceneId_scene_id"
	}),
	scene_nextSceneId: one(scene, {
		fields: [gotoScene.nextSceneId],
		references: [scene.id],
		relationName: "gotoScene_nextSceneId_scene_id"
	}),
}));

export const endSceneRelations = relations(endScene, ({one}) => ({
	scene: one(scene, {
		fields: [endScene.sceneId],
		references: [scene.id]
	}),
}));

export const choiceRelations = relations(choice, ({one}) => ({
	choiceScene: one(choiceScene, {
		fields: [choice.choiceSceneId],
		references: [choiceScene.id]
	}),
	scene: one(scene, {
		fields: [choice.nextSceneId],
		references: [scene.id]
	}),
}));

export const commentRelations = relations(comment, ({one}) => ({
	game: one(game, {
		fields: [comment.gameId],
		references: [game.id]
	}),
	user: one(user, {
		fields: [comment.userId],
		references: [user.id]
	}),
}));

export const likeRelations = relations(like, ({one}) => ({
	game: one(game, {
		fields: [like.gameId],
		references: [game.id]
	}),
	user: one(user, {
		fields: [like.userId],
		references: [user.id]
	}),
}));

export const gameCategoryRelationRelations = relations(gameCategoryRelation, ({one}) => ({
	game: one(game, {
		fields: [gameCategoryRelation.gameId],
		references: [game.id]
	}),
	gameCategory: one(gameCategory, {
		fields: [gameCategoryRelation.gameCategoryId],
		references: [gameCategory.id]
	}),
}));

export const gameCategoryRelations = relations(gameCategory, ({many}) => ({
	gameCategoryRelations: many(gameCategoryRelation),
}));

export const eventRelations = relations(event, ({one, many}) => ({
	scene: one(scene, {
		fields: [event.sceneId],
		references: [scene.id]
	}),
	eventCategoryRelations: many(eventCategoryRelation),
	changeBackgroundEvents: many(changeBackgroundEvent),
	appearCharacterEvents: many(appearCharacterEvent),
	hideCharacterEvents: many(hideCharacterEvent),
	hideAllCharactersEvents: many(hideAllCharactersEvent),
	moveCharacterEvents: many(moveCharacterEvent),
	characterEffectEvents: many(characterEffectEvent),
	bgmStartEvents: many(bgmStartEvent),
	bgmStopEvents: many(bgmStopEvent),
	soundEffectEvents: many(soundEffectEvent),
	appearCgEvents: many(appearCgEvent),
	hideCgEvents: many(hideCgEvent),
	textRenderEvents: many(textRenderEvent),
	appearMessageWindowEvents: many(appearMessageWindowEvent),
	hideMessageWindowEvents: many(hideMessageWindowEvent),
	effectEvents: many(effectEvent),
}));

export const eventCategoryRelationRelations = relations(eventCategoryRelation, ({one}) => ({
	event: one(event, {
		fields: [eventCategoryRelation.eventId],
		references: [event.id]
	}),
	eventCategory: one(eventCategory, {
		fields: [eventCategoryRelation.eventCategoryId],
		references: [eventCategory.id]
	}),
}));

export const eventCategoryRelations = relations(eventCategory, ({many}) => ({
	eventCategoryRelations: many(eventCategoryRelation),
}));

export const changeBackgroundEventRelations = relations(changeBackgroundEvent, ({one}) => ({
	event: one(event, {
		fields: [changeBackgroundEvent.eventId],
		references: [event.id]
	}),
	asset: one(asset, {
		fields: [changeBackgroundEvent.backgroundId],
		references: [asset.id]
	}),
}));

export const appearCharacterEventRelations = relations(appearCharacterEvent, ({one}) => ({
	event: one(event, {
		fields: [appearCharacterEvent.eventId],
		references: [event.id]
	}),
	character: one(character, {
		fields: [appearCharacterEvent.characterId],
		references: [character.id]
	}),
	asset: one(asset, {
		fields: [appearCharacterEvent.characterImageId],
		references: [asset.id]
	}),
}));

export const hideCharacterEventRelations = relations(hideCharacterEvent, ({one}) => ({
	event: one(event, {
		fields: [hideCharacterEvent.eventId],
		references: [event.id]
	}),
	character: one(character, {
		fields: [hideCharacterEvent.characterId],
		references: [character.id]
	}),
}));

export const hideAllCharactersEventRelations = relations(hideAllCharactersEvent, ({one}) => ({
	event: one(event, {
		fields: [hideAllCharactersEvent.eventId],
		references: [event.id]
	}),
}));

export const moveCharacterEventRelations = relations(moveCharacterEvent, ({one}) => ({
	event: one(event, {
		fields: [moveCharacterEvent.eventId],
		references: [event.id]
	}),
	character: one(character, {
		fields: [moveCharacterEvent.characterId],
		references: [character.id]
	}),
}));

export const characterEffectEventRelations = relations(characterEffectEvent, ({one}) => ({
	event: one(event, {
		fields: [characterEffectEvent.eventId],
		references: [event.id]
	}),
	character: one(character, {
		fields: [characterEffectEvent.characterId],
		references: [character.id]
	}),
}));

export const bgmStartEventRelations = relations(bgmStartEvent, ({one}) => ({
	event: one(event, {
		fields: [bgmStartEvent.eventId],
		references: [event.id]
	}),
	asset: one(asset, {
		fields: [bgmStartEvent.bgmId],
		references: [asset.id]
	}),
}));

export const bgmStopEventRelations = relations(bgmStopEvent, ({one}) => ({
	event: one(event, {
		fields: [bgmStopEvent.eventId],
		references: [event.id]
	}),
}));

export const soundEffectEventRelations = relations(soundEffectEvent, ({one}) => ({
	event: one(event, {
		fields: [soundEffectEvent.eventId],
		references: [event.id]
	}),
	asset: one(asset, {
		fields: [soundEffectEvent.soundEffectId],
		references: [asset.id]
	}),
}));

export const appearCgEventRelations = relations(appearCgEvent, ({one}) => ({
	event: one(event, {
		fields: [appearCgEvent.eventId],
		references: [event.id]
	}),
	asset: one(asset, {
		fields: [appearCgEvent.cgImageId],
		references: [asset.id]
	}),
}));

export const hideCgEventRelations = relations(hideCgEvent, ({one}) => ({
	event: one(event, {
		fields: [hideCgEvent.eventId],
		references: [event.id]
	}),
}));

export const textRenderEventRelations = relations(textRenderEvent, ({one}) => ({
	event: one(event, {
		fields: [textRenderEvent.eventId],
		references: [event.id]
	}),
}));

export const appearMessageWindowEventRelations = relations(appearMessageWindowEvent, ({one}) => ({
	event: one(event, {
		fields: [appearMessageWindowEvent.eventId],
		references: [event.id]
	}),
}));

export const hideMessageWindowEventRelations = relations(hideMessageWindowEvent, ({one}) => ({
	event: one(event, {
		fields: [hideMessageWindowEvent.eventId],
		references: [event.id]
	}),
}));

export const effectEventRelations = relations(effectEvent, ({one}) => ({
	event: one(event, {
		fields: [effectEvent.eventId],
		references: [event.id]
	}),
}));