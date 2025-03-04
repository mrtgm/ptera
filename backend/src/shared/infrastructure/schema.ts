import { pgTable, unique, varchar, boolean, uuid, timestamp, index, foreignKey, text, check, jsonb, integer, point, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const user = pgTable("User", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	isDeleted: boolean().default(false).notNull(),
	publicId: uuid().defaultRandom().notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("User_publicId_key").on(table.publicId),
]);

export const userProfile = pgTable("UserProfile", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	bio: text(),
	avatarUrl: varchar({ length: 255 }),
	userId: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_user_profile_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserProfile_userId_fkey"
		}).onDelete("cascade"),
	unique("UserProfile_userId_key").on(table.userId),
]);

export const characterAsset = pgTable("CharacterAsset", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	characterId: varchar({ length: 255 }).notNull(),
	assetId: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_character_asset_asset_id").using("btree", table.assetId.asc().nullsLast().op("text_ops")),
	index("idx_character_asset_character_id").using("btree", table.characterId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "CharacterAsset_characterId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "CharacterAsset_assetId_fkey"
		}).onDelete("cascade"),
]);

export const asset = pgTable("Asset", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	ownerId: varchar({ length: 255 }),
	isPublic: boolean().default(false).notNull(),
	type: varchar({ length: 50 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	url: varchar({ length: 255 }).notNull(),
	metadata: jsonb(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_asset_owner_id").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "Asset_ownerId_fkey"
		}).onDelete("cascade"),
	unique("Asset_publicId_key").on(table.publicId),
	check("Asset_type_check", sql`(type)::text = ANY ((ARRAY['bgm'::character varying, 'soundEffect'::character varying, 'characterImage'::character varying, 'backgroundImage'::character varying, 'cg'::character varying])::text[])`),
]);

export const character = pgTable("Character", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	ownerId: varchar({ length: 255 }),
	isPublic: boolean().default(false).notNull(),
	name: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_character_owner_id").using("btree", table.ownerId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "Character_ownerId_fkey"
		}).onDelete("cascade"),
	unique("Character_publicId_key").on(table.publicId),
]);

export const scene = pgTable("Scene", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	gameId: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_scene_game_id").using("btree", table.gameId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "fk_scene_game"
		}).onDelete("cascade"),
	unique("Scene_publicId_key").on(table.publicId),
]);

export const game = pgTable("Game", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	userId: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	coverImageUrl: varchar({ length: 255 }),
	releaseDate: timestamp({ mode: 'string' }),
	status: varchar({ length: 20 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_game_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Game_userId_fkey"
		}).onDelete("cascade"),
	unique("Game_publicId_key").on(table.publicId),
	check("Game_status_check", sql`(status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying])::text[])`),
]);

export const gameInitialScene = pgTable("GameInitialScene", {
	gameId: varchar({ length: 255 }).primaryKey().notNull(),
	sceneId: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_game_initial_scene_scene_id").using("btree", table.sceneId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "GameInitialScene_gameId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "GameInitialScene_sceneId_fkey"
		}).onDelete("restrict"),
]);

export const choiceScene = pgTable("ChoiceScene", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	sceneId: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "ChoiceScene_sceneId_fkey"
		}).onDelete("cascade"),
	unique("ChoiceScene_publicId_key").on(table.publicId),
	unique("ChoiceScene_sceneId_key").on(table.sceneId),
]);

export const gotoScene = pgTable("GotoScene", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	sceneId: varchar({ length: 255 }).notNull(),
	nextSceneId: varchar({ length: 255 }),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_goto_scene_next_scene_id").using("btree", table.nextSceneId.asc().nullsLast().op("text_ops")),
	index("idx_goto_scene_scene_id").using("btree", table.sceneId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "GotoScene_sceneId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.nextSceneId],
			foreignColumns: [scene.id],
			name: "GotoScene_nextSceneId_fkey"
		}).onDelete("set null"),
	unique("GotoScene_publicId_key").on(table.publicId),
	unique("GotoScene_sceneId_key").on(table.sceneId),
]);

export const endScene = pgTable("EndScene", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	sceneId: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_end_scene_scene_id").using("btree", table.sceneId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "EndScene_sceneId_fkey"
		}).onDelete("cascade"),
	unique("EndScene_publicId_key").on(table.publicId),
	unique("EndScene_sceneId_key").on(table.sceneId),
]);

export const choice = pgTable("Choice", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	choiceSceneId: varchar({ length: 255 }).notNull(),
	text: text().notNull(),
	nextSceneId: varchar({ length: 255 }),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_choice_choice_scene_id").using("btree", table.choiceSceneId.asc().nullsLast().op("text_ops")),
	index("idx_choice_next_scene_id").using("btree", table.nextSceneId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.choiceSceneId],
			foreignColumns: [choiceScene.id],
			name: "Choice_choiceSceneId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.nextSceneId],
			foreignColumns: [scene.id],
			name: "Choice_nextSceneId_fkey"
		}).onDelete("set null"),
	unique("Choice_publicId_key").on(table.publicId),
]);

export const comment = pgTable("Comment", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	gameId: varchar({ length: 255 }).notNull(),
	userId: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_comment_game_id").using("btree", table.gameId.asc().nullsLast().op("text_ops")),
	index("idx_comment_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "Comment_gameId_fkey"
		}).onDelete("cascade"),
	unique("Comment_publicId_key").on(table.publicId),
]);

export const like = pgTable("Like", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	gameId: varchar({ length: 255 }).notNull(),
	userId: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_like_game_id").using("btree", table.gameId.asc().nullsLast().op("text_ops")),
	index("idx_like_user_id").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "Like_gameId_fkey"
		}).onDelete("cascade"),
	unique("Like_publicId_key").on(table.publicId),
	unique("Like_gameId_userId_key").on(table.gameId, table.userId),
]);

export const gameCategoryRelation = pgTable("GameCategoryRelation", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	gameId: varchar({ length: 255 }).notNull(),
	gameCategoryId: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_game_category_relation_category_id").using("btree", table.gameCategoryId.asc().nullsLast().op("text_ops")),
	index("idx_game_category_relation_game_id").using("btree", table.gameId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "GameCategoryRelation_gameId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.gameCategoryId],
			foreignColumns: [gameCategory.id],
			name: "GameCategoryRelation_gameCategoryId_fkey"
		}).onDelete("cascade"),
	unique("GameCategoryRelation_gameId_gameCategoryId_key").on(table.gameId, table.gameCategoryId),
]);

export const gameCategory = pgTable("GameCategory", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	name: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("GameCategory_publicId_key").on(table.publicId),
	unique("GameCategory_name_key").on(table.name),
]);

export const event = pgTable("Event", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	sceneId: varchar({ length: 255 }).notNull(),
	publicId: uuid().defaultRandom().notNull(),
	type: varchar({ length: 50 }).notNull(),
	orderIndex: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_event_scene_id").using("btree", table.sceneId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "Event_sceneId_fkey"
		}).onDelete("cascade"),
	unique("Event_publicId_key").on(table.publicId),
]);

export const eventCategory = pgTable("EventCategory", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	publicId: uuid().defaultRandom().notNull(),
	name: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("EventCategory_publicId_key").on(table.publicId),
	unique("EventCategory_name_key").on(table.name),
]);

export const eventCategoryRelation = pgTable("EventCategoryRelation", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	eventCategoryId: varchar({ length: 255 }).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_event_category_relation_category_id").using("btree", table.eventCategoryId.asc().nullsLast().op("text_ops")),
	index("idx_event_category_relation_event_id").using("btree", table.eventId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "EventCategoryRelation_eventId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.eventCategoryId],
			foreignColumns: [eventCategory.id],
			name: "EventCategoryRelation_eventCategoryId_fkey"
		}).onDelete("cascade"),
	unique("EventCategoryRelation_eventId_eventCategoryId_key").on(table.eventId, table.eventCategoryId),
]);

export const changeBackgroundEvent = pgTable("ChangeBackgroundEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	backgroundId: varchar({ length: 255 }).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("idx_change_background_event_background_id").using("btree", table.backgroundId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "ChangeBackgroundEvent_eventId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.backgroundId],
			foreignColumns: [asset.id],
			name: "ChangeBackgroundEvent_backgroundId_fkey"
		}).onDelete("cascade"),
	unique("ChangeBackgroundEvent_eventId_key").on(table.eventId),
]);

export const appearCharacterEvent = pgTable("AppearCharacterEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	characterId: varchar({ length: 255 }).notNull(),
	characterImageId: varchar({ length: 255 }).notNull(),
	position: point().notNull(),
	scale: numeric({ precision: 10, scale:  2 }).default('1.0').notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "AppearCharacterEvent_eventId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "AppearCharacterEvent_characterId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.characterImageId],
			foreignColumns: [asset.id],
			name: "AppearCharacterEvent_characterImageId_fkey"
		}).onDelete("cascade"),
	unique("AppearCharacterEvent_eventId_key").on(table.eventId),
]);

export const hideCharacterEvent = pgTable("HideCharacterEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	characterId: varchar({ length: 255 }).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "HideCharacterEvent_eventId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "HideCharacterEvent_characterId_fkey"
		}).onDelete("cascade"),
	unique("HideCharacterEvent_eventId_key").on(table.eventId),
]);

export const hideAllCharactersEvent = pgTable("HideAllCharactersEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "HideAllCharactersEvent_eventId_fkey"
		}).onDelete("cascade"),
	unique("HideAllCharactersEvent_eventId_key").on(table.eventId),
]);

export const moveCharacterEvent = pgTable("MoveCharacterEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	characterId: varchar({ length: 255 }).notNull(),
	position: point().notNull(),
	scale: numeric({ precision: 10, scale:  2 }).default('1.0').notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "MoveCharacterEvent_eventId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "MoveCharacterEvent_characterId_fkey"
		}).onDelete("cascade"),
	unique("MoveCharacterEvent_eventId_key").on(table.eventId),
]);

export const characterEffectEvent = pgTable("CharacterEffectEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	characterId: varchar({ length: 255 }).notNull(),
	effectType: varchar({ length: 50 }).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "CharacterEffectEvent_eventId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "CharacterEffectEvent_characterId_fkey"
		}).onDelete("cascade"),
	unique("CharacterEffectEvent_eventId_key").on(table.eventId),
]);

export const bgmStartEvent = pgTable("BGMStartEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	bgmId: varchar({ length: 255 }).notNull(),
	loop: boolean().default(true).notNull(),
	volume: numeric({ precision: 5, scale:  2 }).default('1.0').notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "BGMStartEvent_eventId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.bgmId],
			foreignColumns: [asset.id],
			name: "BGMStartEvent_bgmId_fkey"
		}).onDelete("cascade"),
	unique("BGMStartEvent_eventId_key").on(table.eventId),
]);

export const bgmStopEvent = pgTable("BGMStopEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "BGMStopEvent_eventId_fkey"
		}).onDelete("cascade"),
	unique("BGMStopEvent_eventId_key").on(table.eventId),
]);

export const soundEffectEvent = pgTable("SoundEffectEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	soundEffectId: varchar({ length: 255 }).notNull(),
	volume: numeric({ precision: 5, scale:  2 }).default('1.0').notNull(),
	loop: boolean().default(false).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "SoundEffectEvent_eventId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.soundEffectId],
			foreignColumns: [asset.id],
			name: "SoundEffectEvent_soundEffectId_fkey"
		}).onDelete("cascade"),
	unique("SoundEffectEvent_eventId_key").on(table.eventId),
]);

export const hideCgEvent = pgTable("HideCGEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "HideCGEvent_eventId_fkey"
		}).onDelete("cascade"),
	unique("HideCGEvent_eventId_key").on(table.eventId),
]);

export const appearCgEvent = pgTable("AppearCGEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	cgImageId: varchar({ length: 255 }).notNull(),
	position: point().notNull(),
	scale: numeric({ precision: 10, scale:  2 }).default('1.0').notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "AppearCGEvent_eventId_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.cgImageId],
			foreignColumns: [asset.id],
			name: "AppearCGEvent_cgImageId_fkey"
		}).onDelete("cascade"),
	unique("AppearCGEvent_eventId_key").on(table.eventId),
]);

export const textRenderEvent = pgTable("TextRenderEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	text: text().notNull(),
	characterName: varchar({ length: 255 }),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "TextRenderEvent_eventId_fkey"
		}).onDelete("cascade"),
	unique("TextRenderEvent_eventId_key").on(table.eventId),
]);

export const appearMessageWindowEvent = pgTable("AppearMessageWindowEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "AppearMessageWindowEvent_eventId_fkey"
		}).onDelete("cascade"),
	unique("AppearMessageWindowEvent_eventId_key").on(table.eventId),
]);

export const hideMessageWindowEvent = pgTable("HideMessageWindowEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "HideMessageWindowEvent_eventId_fkey"
		}).onDelete("cascade"),
	unique("HideMessageWindowEvent_eventId_key").on(table.eventId),
]);

export const effectEvent = pgTable("EffectEvent", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	eventId: varchar({ length: 255 }).notNull(),
	effectType: varchar({ length: 50 }).notNull(),
	transitionDuration: integer().default(0).notNull(),
	updatedAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	createdAt: timestamp({ mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "EffectEvent_eventId_fkey"
		}).onDelete("cascade"),
	unique("EffectEvent_eventId_key").on(table.eventId),
]);
