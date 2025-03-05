-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "User" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "User_publicId_key" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE "UserProfile" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"bio" text,
	"avatarUrl" varchar(255),
	"userId" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "UserProfile_userId_key" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "CharacterAsset" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"characterId" varchar(255) NOT NULL,
	"assetId" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Asset" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"ownerId" varchar(255),
	"isPublic" boolean DEFAULT false NOT NULL,
	"type" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"metadata" jsonb,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Asset_publicId_key" UNIQUE("publicId"),
	CONSTRAINT "Asset_type_check" CHECK ((type)::text = ANY ((ARRAY['bgm'::character varying, 'soundEffect'::character varying, 'characterImage'::character varying, 'backgroundImage'::character varying, 'cg'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "Character" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"ownerId" varchar(255),
	"isPublic" boolean DEFAULT false NOT NULL,
	"name" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Character_publicId_key" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE "Scene" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"gameId" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Scene_publicId_key" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE "Game" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"coverImageUrl" varchar(255),
	"releaseDate" timestamp,
	"status" varchar(20) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Game_publicId_key" UNIQUE("publicId"),
	CONSTRAINT "Game_status_check" CHECK ((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "GameInitialScene" (
	"gameId" varchar(255) PRIMARY KEY NOT NULL,
	"sceneId" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ChoiceScene" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"sceneId" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "ChoiceScene_publicId_key" UNIQUE("publicId"),
	CONSTRAINT "ChoiceScene_sceneId_key" UNIQUE("sceneId")
);
--> statement-breakpoint
CREATE TABLE "GotoScene" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"sceneId" varchar(255) NOT NULL,
	"nextSceneId" varchar(255),
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "GotoScene_publicId_key" UNIQUE("publicId"),
	CONSTRAINT "GotoScene_sceneId_key" UNIQUE("sceneId")
);
--> statement-breakpoint
CREATE TABLE "EndScene" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"sceneId" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "EndScene_publicId_key" UNIQUE("publicId"),
	CONSTRAINT "EndScene_sceneId_key" UNIQUE("sceneId")
);
--> statement-breakpoint
CREATE TABLE "Choice" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"choiceSceneId" varchar(255) NOT NULL,
	"text" text NOT NULL,
	"nextSceneId" varchar(255),
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Choice_publicId_key" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE "Comment" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"gameId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Comment_publicId_key" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE "Like" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"gameId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Like_publicId_key" UNIQUE("publicId"),
	CONSTRAINT "Like_gameId_userId_key" UNIQUE("gameId","userId")
);
--> statement-breakpoint
CREATE TABLE "GameCategoryRelation" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"gameId" varchar(255) NOT NULL,
	"gameCategoryId" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "GameCategoryRelation_gameId_gameCategoryId_key" UNIQUE("gameId","gameCategoryId")
);
--> statement-breakpoint
CREATE TABLE "GameCategory" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "GameCategory_publicId_key" UNIQUE("publicId"),
	CONSTRAINT "GameCategory_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "Event" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"sceneId" varchar(255) NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(50) NOT NULL,
	"orderIndex" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "Event_publicId_key" UNIQUE("publicId")
);
--> statement-breakpoint
CREATE TABLE "EventCategory" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"publicId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "EventCategory_publicId_key" UNIQUE("publicId"),
	CONSTRAINT "EventCategory_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "EventCategoryRelation" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"eventCategoryId" varchar(255) NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "EventCategoryRelation_eventId_eventCategoryId_key" UNIQUE("eventId","eventCategoryId")
);
--> statement-breakpoint
CREATE TABLE "ChangeBackgroundEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"backgroundId" varchar(255) NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "ChangeBackgroundEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "AppearCharacterEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"characterId" varchar(255) NOT NULL,
	"characterImageId" varchar(255) NOT NULL,
	"position" "point" NOT NULL,
	"scale" numeric(10, 2) DEFAULT '1.0' NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "AppearCharacterEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "HideCharacterEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"characterId" varchar(255) NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "HideCharacterEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "HideAllCharactersEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "HideAllCharactersEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "MoveCharacterEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"characterId" varchar(255) NOT NULL,
	"position" "point" NOT NULL,
	"scale" numeric(10, 2) DEFAULT '1.0' NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "MoveCharacterEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "CharacterEffectEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"characterId" varchar(255) NOT NULL,
	"effectType" varchar(50) NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "CharacterEffectEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "BGMStartEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"bgmId" varchar(255) NOT NULL,
	"loop" boolean DEFAULT true NOT NULL,
	"volume" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "BGMStartEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "BGMStopEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "BGMStopEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "SoundEffectEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"soundEffectId" varchar(255) NOT NULL,
	"volume" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"loop" boolean DEFAULT false NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "SoundEffectEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "HideCGEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "HideCGEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "AppearCGEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"cgImageId" varchar(255) NOT NULL,
	"position" "point" NOT NULL,
	"scale" numeric(10, 2) DEFAULT '1.0' NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "AppearCGEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "TextRenderEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"text" text NOT NULL,
	"characterName" varchar(255),
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "TextRenderEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "AppearMessageWindowEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "AppearMessageWindowEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "HideMessageWindowEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "HideMessageWindowEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
CREATE TABLE "EffectEvent" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"eventId" varchar(255) NOT NULL,
	"effectType" varchar(50) NOT NULL,
	"transitionDuration" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "EffectEvent_eventId_key" UNIQUE("eventId")
);
--> statement-breakpoint
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CharacterAsset" ADD CONSTRAINT "CharacterAsset_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CharacterAsset" ADD CONSTRAINT "CharacterAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."Asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Character" ADD CONSTRAINT "Character_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Scene" ADD CONSTRAINT "fk_scene_game" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GameInitialScene" ADD CONSTRAINT "GameInitialScene_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GameInitialScene" ADD CONSTRAINT "GameInitialScene_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "public"."Scene"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChoiceScene" ADD CONSTRAINT "ChoiceScene_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "public"."Scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GotoScene" ADD CONSTRAINT "GotoScene_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "public"."Scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GotoScene" ADD CONSTRAINT "GotoScene_nextSceneId_fkey" FOREIGN KEY ("nextSceneId") REFERENCES "public"."Scene"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EndScene" ADD CONSTRAINT "EndScene_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "public"."Scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_choiceSceneId_fkey" FOREIGN KEY ("choiceSceneId") REFERENCES "public"."ChoiceScene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_nextSceneId_fkey" FOREIGN KEY ("nextSceneId") REFERENCES "public"."Scene"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GameCategoryRelation" ADD CONSTRAINT "GameCategoryRelation_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GameCategoryRelation" ADD CONSTRAINT "GameCategoryRelation_gameCategoryId_fkey" FOREIGN KEY ("gameCategoryId") REFERENCES "public"."GameCategory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "public"."Scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EventCategoryRelation" ADD CONSTRAINT "EventCategoryRelation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EventCategoryRelation" ADD CONSTRAINT "EventCategoryRelation_eventCategoryId_fkey" FOREIGN KEY ("eventCategoryId") REFERENCES "public"."EventCategory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChangeBackgroundEvent" ADD CONSTRAINT "ChangeBackgroundEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ChangeBackgroundEvent" ADD CONSTRAINT "ChangeBackgroundEvent_backgroundId_fkey" FOREIGN KEY ("backgroundId") REFERENCES "public"."Asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AppearCharacterEvent" ADD CONSTRAINT "AppearCharacterEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AppearCharacterEvent" ADD CONSTRAINT "AppearCharacterEvent_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AppearCharacterEvent" ADD CONSTRAINT "AppearCharacterEvent_characterImageId_fkey" FOREIGN KEY ("characterImageId") REFERENCES "public"."Asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "HideCharacterEvent" ADD CONSTRAINT "HideCharacterEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "HideCharacterEvent" ADD CONSTRAINT "HideCharacterEvent_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "HideAllCharactersEvent" ADD CONSTRAINT "HideAllCharactersEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "MoveCharacterEvent" ADD CONSTRAINT "MoveCharacterEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "MoveCharacterEvent" ADD CONSTRAINT "MoveCharacterEvent_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CharacterEffectEvent" ADD CONSTRAINT "CharacterEffectEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "CharacterEffectEvent" ADD CONSTRAINT "CharacterEffectEvent_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BGMStartEvent" ADD CONSTRAINT "BGMStartEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BGMStartEvent" ADD CONSTRAINT "BGMStartEvent_bgmId_fkey" FOREIGN KEY ("bgmId") REFERENCES "public"."Asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BGMStopEvent" ADD CONSTRAINT "BGMStopEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SoundEffectEvent" ADD CONSTRAINT "SoundEffectEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SoundEffectEvent" ADD CONSTRAINT "SoundEffectEvent_soundEffectId_fkey" FOREIGN KEY ("soundEffectId") REFERENCES "public"."Asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "HideCGEvent" ADD CONSTRAINT "HideCGEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AppearCGEvent" ADD CONSTRAINT "AppearCGEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AppearCGEvent" ADD CONSTRAINT "AppearCGEvent_cgImageId_fkey" FOREIGN KEY ("cgImageId") REFERENCES "public"."Asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TextRenderEvent" ADD CONSTRAINT "TextRenderEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "AppearMessageWindowEvent" ADD CONSTRAINT "AppearMessageWindowEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "HideMessageWindowEvent" ADD CONSTRAINT "HideMessageWindowEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "EffectEvent" ADD CONSTRAINT "EffectEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_profile_user_id" ON "UserProfile" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_character_asset_asset_id" ON "CharacterAsset" USING btree ("assetId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_character_asset_character_id" ON "CharacterAsset" USING btree ("characterId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_asset_owner_id" ON "Asset" USING btree ("ownerId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_character_owner_id" ON "Character" USING btree ("ownerId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_scene_game_id" ON "Scene" USING btree ("gameId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_game_user_id" ON "Game" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_game_initial_scene_scene_id" ON "GameInitialScene" USING btree ("sceneId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_goto_scene_next_scene_id" ON "GotoScene" USING btree ("nextSceneId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_goto_scene_scene_id" ON "GotoScene" USING btree ("sceneId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_end_scene_scene_id" ON "EndScene" USING btree ("sceneId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_choice_choice_scene_id" ON "Choice" USING btree ("choiceSceneId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_choice_next_scene_id" ON "Choice" USING btree ("nextSceneId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_comment_game_id" ON "Comment" USING btree ("gameId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_comment_user_id" ON "Comment" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_like_game_id" ON "Like" USING btree ("gameId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_like_user_id" ON "Like" USING btree ("userId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_game_category_relation_category_id" ON "GameCategoryRelation" USING btree ("gameCategoryId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_game_category_relation_game_id" ON "GameCategoryRelation" USING btree ("gameId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_event_scene_id" ON "Event" USING btree ("sceneId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_event_category_relation_category_id" ON "EventCategoryRelation" USING btree ("eventCategoryId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_event_category_relation_event_id" ON "EventCategoryRelation" USING btree ("eventId" text_ops);--> statement-breakpoint
CREATE INDEX "idx_change_background_event_background_id" ON "ChangeBackgroundEvent" USING btree ("backgroundId" text_ops);
*/