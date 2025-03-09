import { sql } from "drizzle-orm";
import {
	boolean,
	check,
	foreignKey,
	index,
	integer,
	jsonb,
	numeric,
	pgTable,
	point,
	text,
	timestamp,
	unique,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const hideAllCharactersEvent = pgTable(
	"hide_all_characters_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "hide_all_characters_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_hide_all_characters_event_event",
		}).onDelete("cascade"),
		unique("hide_all_characters_event_event_id_key").on(table.eventId),
	],
);

export const changeBackgroundEvent = pgTable(
	"change_background_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "change_background_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		backgroundId: integer("background_id").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_change_background_event_background_id").using(
			"btree",
			table.backgroundId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_change_background_event_event",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.backgroundId],
			foreignColumns: [asset.id],
			name: "fk_change_background_event_background",
		}).onDelete("cascade"),
		unique("change_background_event_event_id_key").on(table.eventId),
	],
);

export const appearCharacterEvent = pgTable(
	"appear_character_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "appear_character_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		characterId: integer("character_id").notNull(),
		characterImageId: integer("character_image_id").notNull(),
		position: point().notNull(),
		scale: numeric({ precision: 10, scale: 2 }).default("1.0").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_appear_character_event_event",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "fk_appear_character_event_character",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.characterImageId],
			foreignColumns: [asset.id],
			name: "fk_appear_character_event_image",
		}).onDelete("cascade"),
		unique("appear_character_event_event_id_key").on(table.eventId),
	],
);

export const hideCharacterEvent = pgTable(
	"hide_character_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "hide_character_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		characterId: integer("character_id").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_hide_character_event_event",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "fk_hide_character_event_character",
		}).onDelete("cascade"),
		unique("hide_character_event_event_id_key").on(table.eventId),
	],
);

export const moveCharacterEvent = pgTable(
	"move_character_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "move_character_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		characterId: integer("character_id").notNull(),
		position: point().notNull(),
		scale: numeric({ precision: 10, scale: 2 }).default("1.0").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_move_character_event_event",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "fk_move_character_event_character",
		}).onDelete("cascade"),
		unique("move_character_event_event_id_key").on(table.eventId),
	],
);

export const characterEffectEvent = pgTable(
	"character_effect_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "character_effect_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		characterId: integer("character_id").notNull(),
		effectType: varchar("effect_type", { length: 50 }).notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_character_effect_event_event",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "fk_character_effect_event_character",
		}).onDelete("cascade"),
		unique("character_effect_event_event_id_key").on(table.eventId),
	],
);

export const bgmStartEvent = pgTable(
	"bgm_start_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "bgm_start_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		bgmId: integer("bgm_id").notNull(),
		loop: boolean().default(true).notNull(),
		volume: numeric({ precision: 5, scale: 2 }).default("1.0").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_bgm_start_event_event",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.bgmId],
			foreignColumns: [asset.id],
			name: "fk_bgm_start_event_bgm",
		}).onDelete("cascade"),
		unique("bgm_start_event_event_id_key").on(table.eventId),
	],
);

export const bgmStopEvent = pgTable(
	"bgm_stop_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "bgm_stop_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_bgm_stop_event_event",
		}).onDelete("cascade"),
		unique("bgm_stop_event_event_id_key").on(table.eventId),
	],
);

export const soundEffectEvent = pgTable(
	"sound_effect_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "sound_effect_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		soundEffectId: integer("sound_effect_id").notNull(),
		volume: numeric({ precision: 5, scale: 2 }).default("1.0").notNull(),
		loop: boolean().default(false).notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_sound_effect_event_event",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.soundEffectId],
			foreignColumns: [asset.id],
			name: "fk_sound_effect_event_sound",
		}).onDelete("cascade"),
		unique("sound_effect_event_event_id_key").on(table.eventId),
	],
);

export const user = pgTable(
	"user",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "user_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		isDeleted: boolean("is_deleted").default(false).notNull(),
		jwtSub: varchar("jwt_sub", { length: 255 }).notNull(),
		publicId: uuid("public_id").defaultRandom().notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		unique("user_jwt_sub_key").on(table.jwtSub),
		unique("user_public_id_key").on(table.publicId),
	],
);

export const userProfile = pgTable(
	"user_profile",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "user_profile_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		name: varchar({ length: 255 }).notNull(),
		bio: text(),
		avatarUrl: varchar("avatar_url", { length: 255 }),
		userId: integer("user_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_user_profile_user_id").using(
			"btree",
			table.userId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "fk_user_profile_user",
		}).onDelete("cascade"),
		unique("user_profile_user_id_key").on(table.userId),
	],
);

export const asset = pgTable(
	"asset",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "asset_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		ownerId: integer("owner_id"),
		isPublic: boolean("is_public").default(false).notNull(),
		type: varchar({ length: 50 }).notNull(),
		name: varchar({ length: 255 }).notNull(),
		url: varchar({ length: 255 }).notNull(),
		metadata: jsonb(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_asset_owner_id").using(
			"btree",
			table.ownerId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "fk_asset_owner",
		}).onDelete("cascade"),
		unique("asset_public_id_key").on(table.publicId),
		check(
			"asset_type_check",
			sql`(type)::text = ANY ((ARRAY['bgm'::character varying, 'soundEffect'::character varying, 'characterImage'::character varying, 'backgroundImage'::character varying, 'cg'::character varying])::text[])`,
		),
	],
);

export const character = pgTable(
	"character",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "character_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		ownerId: integer("owner_id"),
		isPublic: boolean("is_public").default(false).notNull(),
		name: varchar({ length: 255 }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_character_owner_id").using(
			"btree",
			table.ownerId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.ownerId],
			foreignColumns: [user.id],
			name: "fk_character_owner",
		}).onDelete("cascade"),
		unique("character_public_id_key").on(table.publicId),
	],
);

export const characterAsset = pgTable(
	"character_asset",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "character_asset_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		characterId: integer("character_id").notNull(),
		assetId: integer("asset_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_character_asset_asset_id").using(
			"btree",
			table.assetId.asc().nullsLast().op("int4_ops"),
		),
		index("idx_character_asset_character_id").using(
			"btree",
			table.characterId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "fk_character_asset_character",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "fk_character_asset_asset",
		}).onDelete("cascade"),
	],
);

export const game = pgTable(
	"game",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "game_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		userId: integer("user_id").notNull(),
		name: varchar({ length: 255 }).notNull(),
		description: text(),
		coverImageUrl: varchar("cover_image_url", { length: 255 }),
		releaseDate: timestamp("release_date", { mode: "string" }),
		status: varchar({ length: 20 }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_game_user_id").using(
			"btree",
			table.userId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "fk_game_user",
		}).onDelete("cascade"),
		unique("game_public_id_key").on(table.publicId),
		check(
			"game_status_check",
			sql`(status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying])::text[])`,
		),
	],
);

export const gamePlay = pgTable(
	"game_play",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "game_play_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		gameId: integer("game_id").notNull(),
		userId: integer("user_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("game_play_game_id_idx").using(
			"btree",
			table.gameId.asc().nullsLast().op("int4_ops"),
		),
		index("game_play_user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "fk_game_play_game",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "fk_game_play_user",
		}).onDelete("cascade"),
	],
);

export const gameInitialScene = pgTable(
	"game_initial_scene",
	{
		gameId: integer("game_id").primaryKey().notNull(),
		sceneId: integer("scene_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_game_initial_scene_scene_id").using(
			"btree",
			table.sceneId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "fk_game_initial_scene_game",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "fk_game_initial_scene_scene",
		}).onDelete("restrict"),
	],
);

export const scene = pgTable(
	"scene",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "scene_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		gameId: integer("game_id").notNull(),
		name: varchar({ length: 255 }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_scene_game_id").using(
			"btree",
			table.gameId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "fk_scene_game",
		}).onDelete("cascade"),
		unique("scene_public_id_key").on(table.publicId),
	],
);

export const choiceScene = pgTable(
	"choice_scene",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "choice_scene_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		sceneId: integer("scene_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "fk_choice_scene_scene",
		}).onDelete("cascade"),
		unique("choice_scene_public_id_key").on(table.publicId),
		unique("choice_scene_scene_id_key").on(table.sceneId),
	],
);

export const gotoScene = pgTable(
	"goto_scene",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "goto_scene_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		sceneId: integer("scene_id").notNull(),
		nextSceneId: integer("next_scene_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_goto_scene_next_scene_id").using(
			"btree",
			table.nextSceneId.asc().nullsLast().op("int4_ops"),
		),
		index("idx_goto_scene_scene_id").using(
			"btree",
			table.sceneId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "fk_goto_scene_scene",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.nextSceneId],
			foreignColumns: [scene.id],
			name: "fk_goto_scene_next_scene",
		}).onDelete("set null"),
		unique("goto_scene_public_id_key").on(table.publicId),
		unique("goto_scene_scene_id_key").on(table.sceneId),
	],
);

export const endScene = pgTable(
	"end_scene",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "end_scene_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		sceneId: integer("scene_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_end_scene_scene_id").using(
			"btree",
			table.sceneId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "fk_end_scene_scene",
		}).onDelete("cascade"),
		unique("end_scene_public_id_key").on(table.publicId),
		unique("end_scene_scene_id_key").on(table.sceneId),
	],
);

export const choice = pgTable(
	"choice",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "choice_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		choiceSceneId: integer("choice_scene_id").notNull(),
		text: text().notNull(),
		nextSceneId: integer("next_scene_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_choice_choice_scene_id").using(
			"btree",
			table.choiceSceneId.asc().nullsLast().op("int4_ops"),
		),
		index("idx_choice_next_scene_id").using(
			"btree",
			table.nextSceneId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.choiceSceneId],
			foreignColumns: [choiceScene.id],
			name: "fk_choice_choice_scene",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.nextSceneId],
			foreignColumns: [scene.id],
			name: "fk_choice_next_scene",
		}).onDelete("set null"),
		unique("choice_public_id_key").on(table.publicId),
	],
);

export const assetGame = pgTable(
	"asset_game",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "asset_game_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		assetId: integer("asset_id").notNull(),
		gameId: integer("game_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_asset_game_asset_id").using(
			"btree",
			table.assetId.asc().nullsLast().op("int4_ops"),
		),
		index("idx_asset_game_game_id").using(
			"btree",
			table.gameId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.assetId],
			foreignColumns: [asset.id],
			name: "fk_asset_game_asset",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "fk_asset_game_game",
		}).onDelete("cascade"),
	],
);

export const characterGame = pgTable(
	"character_game",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "character_game_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		characterId: integer("character_id").notNull(),
		gameId: integer("game_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_character_game_character_id").using(
			"btree",
			table.characterId.asc().nullsLast().op("int4_ops"),
		),
		index("idx_character_game_game_id").using(
			"btree",
			table.gameId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.characterId],
			foreignColumns: [character.id],
			name: "fk_character_game_character",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "fk_character_game_game",
		}).onDelete("cascade"),
	],
);

export const comment = pgTable(
	"comment",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "comment_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		gameId: integer("game_id").notNull(),
		userId: integer("user_id").notNull(),
		content: text().notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_comment_game_id").using(
			"btree",
			table.gameId.asc().nullsLast().op("int4_ops"),
		),
		index("idx_comment_user_id").using(
			"btree",
			table.userId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "fk_comment_game",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "fk_comment_user",
		}).onDelete("cascade"),
		unique("comment_public_id_key").on(table.publicId),
	],
);

export const like = pgTable(
	"like",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "like_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		gameId: integer("game_id").notNull(),
		userId: integer("user_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_like_game_id").using(
			"btree",
			table.gameId.asc().nullsLast().op("int4_ops"),
		),
		index("idx_like_user_id").using(
			"btree",
			table.userId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "fk_like_game",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "fk_like_user",
		}).onDelete("cascade"),
		unique("like_public_id_key").on(table.publicId),
		unique("like_game_id_user_id_key").on(table.gameId, table.userId),
	],
);

export const gameCategoryRelation = pgTable(
	"game_category_relation",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "game_category_relation_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		gameId: integer("game_id").notNull(),
		gameCategoryId: integer("game_category_id").notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_game_category_relation_category_id").using(
			"btree",
			table.gameCategoryId.asc().nullsLast().op("int4_ops"),
		),
		index("idx_game_category_relation_game_id").using(
			"btree",
			table.gameId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.gameId],
			foreignColumns: [game.id],
			name: "fk_game_category_relation_game",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.gameCategoryId],
			foreignColumns: [gameCategory.id],
			name: "fk_game_category_relation_category",
		}).onDelete("cascade"),
		unique("uq_game_category_relation").on(table.gameId, table.gameCategoryId),
	],
);

export const gameCategory = pgTable(
	"game_category",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "game_category_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		publicId: uuid("public_id").defaultRandom().notNull(),
		name: varchar({ length: 255 }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		unique("game_category_public_id_key").on(table.publicId),
		unique("game_category_name_key").on(table.name),
	],
);

export const event = pgTable(
	"event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		sceneId: integer("scene_id").notNull(),
		publicId: uuid("public_id").defaultRandom().notNull(),
		type: varchar({ length: 50 }).notNull(),
		category: varchar({ length: 50 }).notNull(),
		orderIndex: varchar("order_index", { length: 255 }).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		index("idx_event_scene_id").using(
			"btree",
			table.sceneId.asc().nullsLast().op("int4_ops"),
		),
		foreignKey({
			columns: [table.sceneId],
			foreignColumns: [scene.id],
			name: "fk_event_scene",
		}).onDelete("cascade"),
		unique("event_public_id_key").on(table.publicId),
	],
);

export const appearCgEvent = pgTable(
	"appear_cg_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "appear_cg_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		cgImageId: integer("cg_image_id").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_appear_cg_event_event",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.cgImageId],
			foreignColumns: [asset.id],
			name: "fk_appear_cg_event_image",
		}).onDelete("cascade"),
		unique("appear_cg_event_event_id_key").on(table.eventId),
	],
);

export const hideCgEvent = pgTable(
	"hide_cg_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "hide_cg_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_hide_cg_event_event",
		}).onDelete("cascade"),
		unique("hide_cg_event_event_id_key").on(table.eventId),
	],
);

export const textRenderEvent = pgTable(
	"text_render_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "text_render_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		text: text().notNull(),
		characterName: varchar("character_name", { length: 255 }),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_text_render_event_event",
		}).onDelete("cascade"),
		unique("text_render_event_event_id_key").on(table.eventId),
	],
);

export const appearMessageWindowEvent = pgTable(
	"appear_message_window_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "appear_message_window_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_appear_message_window_event_event",
		}).onDelete("cascade"),
		unique("appear_message_window_event_event_id_key").on(table.eventId),
	],
);

export const hideMessageWindowEvent = pgTable(
	"hide_message_window_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "hide_message_window_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_hide_message_window_event_event",
		}).onDelete("cascade"),
		unique("hide_message_window_event_event_id_key").on(table.eventId),
	],
);

export const effectEvent = pgTable(
	"effect_event",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity({
			name: "effect_event_id_seq",
			startWith: 1,
			increment: 1,
			minValue: 1,
			maxValue: 2147483647,
			cache: 1,
		}),
		eventId: integer("event_id").notNull(),
		effectType: varchar("effect_type", { length: 50 }).notNull(),
		transitionDuration: integer("transition_duration").default(0).notNull(),
		updatedAt: timestamp("updated_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		createdAt: timestamp("created_at", { mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "fk_effect_event_event",
		}).onDelete("cascade"),
		unique("effect_event_event_id_key").on(table.eventId),
	],
);
