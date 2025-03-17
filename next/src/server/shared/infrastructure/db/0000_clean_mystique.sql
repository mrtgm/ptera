CREATE TABLE "appear_cg_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "appear_cg_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"cg_image_id" integer NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "appear_cg_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "appear_character_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "appear_character_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"character_id" integer NOT NULL,
	"character_image_id" integer NOT NULL,
	"position" "point" NOT NULL,
	"scale" numeric(10, 2) DEFAULT '1.0' NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "appear_character_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "appear_message_window_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "appear_message_window_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "appear_message_window_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "asset" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "asset_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"owner_id" integer,
	"is_public" boolean DEFAULT false NOT NULL,
	"asset_type" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" varchar(255) NOT NULL,
	"metadata" jsonb,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "asset_type_check" CHECK ((asset_type)::text = ANY ((ARRAY['bgm'::character varying, 'soundEffect'::character varying, 'characterImage'::character varying, 'backgroundImage'::character varying, 'cgImage'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "asset_game" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "asset_game_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"asset_id" integer NOT NULL,
	"game_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_asset_game" UNIQUE("asset_id","game_id")
);
--> statement-breakpoint
CREATE TABLE "bgm_start_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bgm_start_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"bgm_id" integer NOT NULL,
	"loop" boolean DEFAULT true NOT NULL,
	"volume" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "bgm_start_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "bgm_stop_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bgm_stop_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "bgm_stop_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "change_background_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "change_background_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"background_id" integer NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "change_background_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "character" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "character_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"owner_id" integer,
	"is_public" boolean DEFAULT false NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_asset" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "character_asset_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"character_id" integer NOT NULL,
	"asset_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "character_effect_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "character_effect_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"character_id" integer NOT NULL,
	"effect_type" varchar(50) NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "character_effect_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "character_game" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "character_game_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"character_id" integer NOT NULL,
	"game_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_character_game" UNIQUE("character_id","game_id")
);
--> statement-breakpoint
CREATE TABLE "choice" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "choice_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"choice_scene_id" integer NOT NULL,
	"text" text NOT NULL,
	"next_scene_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "choice_scene" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "choice_scene_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"scene_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "choice_scene_scene_id_key" UNIQUE("scene_id")
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"game_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"content" text NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "effect_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "effect_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"effect_type" varchar(50) NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "effect_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "end_scene" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "end_scene_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"scene_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "end_scene_scene_id_key" UNIQUE("scene_id")
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"scene_id" integer NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"category" varchar(50) NOT NULL,
	"order_index" varchar(255) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"cover_image_url" varchar(255),
	"release_date" timestamp,
	"status" varchar(20) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "game_status_check" CHECK ((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "game_category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "game_category_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "game_category_relation" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_category_relation_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"game_id" integer NOT NULL,
	"game_category_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_game_category_relation" UNIQUE("game_id","game_category_id")
);
--> statement-breakpoint
CREATE TABLE "game_initial_scene" (
	"game_id" integer PRIMARY KEY NOT NULL,
	"scene_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_play" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_play_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"game_id" integer NOT NULL,
	"user_id" integer,
	"guest_id" uuid,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "uq_game_play_user_id" UNIQUE("game_id","user_id"),
	CONSTRAINT "uq_game_play_guest_id" UNIQUE("game_id","guest_id")
);
--> statement-breakpoint
CREATE TABLE "goto_scene" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "goto_scene_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"scene_id" integer NOT NULL,
	"next_scene_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "goto_scene_scene_id_key" UNIQUE("scene_id")
);
--> statement-breakpoint
CREATE TABLE "hide_all_characters_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "hide_all_characters_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "hide_all_characters_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "hide_cg_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "hide_cg_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "hide_cg_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "hide_character_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "hide_character_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"character_id" integer NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "hide_character_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "hide_message_window_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "hide_message_window_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "hide_message_window_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "like" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "like_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"game_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "like_game_id_user_id_key" UNIQUE("game_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "move_character_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "move_character_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"character_id" integer NOT NULL,
	"position" "point" NOT NULL,
	"scale" numeric(10, 2) DEFAULT '1.0' NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "move_character_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "scene" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "scene_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"game_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sound_effect_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sound_effect_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"sound_effect_id" integer NOT NULL,
	"volume" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"loop" boolean DEFAULT false NOT NULL,
	"transition_duration" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "sound_effect_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "text_render_event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "text_render_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"text" text NOT NULL,
	"character_name" varchar(255),
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "text_render_event_event_id_key" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"is_deleted" boolean DEFAULT false NOT NULL,
	"jwt_sub" varchar(255) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_jwt_sub_key" UNIQUE("jwt_sub")
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"bio" text,
	"avatar_url" varchar(255),
	"user_id" integer NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "user_profile_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "appear_cg_event" ADD CONSTRAINT "fk_appear_cg_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appear_cg_event" ADD CONSTRAINT "fk_appear_cg_event_image" FOREIGN KEY ("cg_image_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appear_character_event" ADD CONSTRAINT "fk_appear_character_event_character" FOREIGN KEY ("character_id") REFERENCES "public"."character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appear_character_event" ADD CONSTRAINT "fk_appear_character_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appear_character_event" ADD CONSTRAINT "fk_appear_character_event_image" FOREIGN KEY ("character_image_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appear_message_window_event" ADD CONSTRAINT "fk_appear_message_window_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset" ADD CONSTRAINT "fk_asset_owner" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_game" ADD CONSTRAINT "fk_asset_game_asset" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_game" ADD CONSTRAINT "fk_asset_game_game" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bgm_start_event" ADD CONSTRAINT "fk_bgm_start_event_bgm" FOREIGN KEY ("bgm_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bgm_start_event" ADD CONSTRAINT "fk_bgm_start_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bgm_stop_event" ADD CONSTRAINT "fk_bgm_stop_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_background_event" ADD CONSTRAINT "fk_change_background_event_background" FOREIGN KEY ("background_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "change_background_event" ADD CONSTRAINT "fk_change_background_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character" ADD CONSTRAINT "fk_character_owner" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_asset" ADD CONSTRAINT "fk_character_asset_asset" FOREIGN KEY ("asset_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_asset" ADD CONSTRAINT "fk_character_asset_character" FOREIGN KEY ("character_id") REFERENCES "public"."character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_effect_event" ADD CONSTRAINT "fk_character_effect_event_character" FOREIGN KEY ("character_id") REFERENCES "public"."character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_effect_event" ADD CONSTRAINT "fk_character_effect_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_game" ADD CONSTRAINT "fk_character_game_character" FOREIGN KEY ("character_id") REFERENCES "public"."character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_game" ADD CONSTRAINT "fk_character_game_game" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "choice" ADD CONSTRAINT "fk_choice_choice_scene" FOREIGN KEY ("choice_scene_id") REFERENCES "public"."choice_scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "choice" ADD CONSTRAINT "fk_choice_next_scene" FOREIGN KEY ("next_scene_id") REFERENCES "public"."scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "choice_scene" ADD CONSTRAINT "fk_choice_scene_scene" FOREIGN KEY ("scene_id") REFERENCES "public"."scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "fk_comment_game" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "fk_comment_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "effect_event" ADD CONSTRAINT "fk_effect_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "end_scene" ADD CONSTRAINT "fk_end_scene_scene" FOREIGN KEY ("scene_id") REFERENCES "public"."scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "fk_event_scene" FOREIGN KEY ("scene_id") REFERENCES "public"."scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "fk_game_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_category_relation" ADD CONSTRAINT "fk_game_category_relation_category" FOREIGN KEY ("game_category_id") REFERENCES "public"."game_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_category_relation" ADD CONSTRAINT "fk_game_category_relation_game" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_initial_scene" ADD CONSTRAINT "fk_game_initial_scene_game" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_initial_scene" ADD CONSTRAINT "fk_game_initial_scene_scene" FOREIGN KEY ("scene_id") REFERENCES "public"."scene"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_play" ADD CONSTRAINT "fk_game_play_game" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_play" ADD CONSTRAINT "fk_game_play_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goto_scene" ADD CONSTRAINT "fk_goto_scene_next_scene" FOREIGN KEY ("next_scene_id") REFERENCES "public"."scene"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goto_scene" ADD CONSTRAINT "fk_goto_scene_scene" FOREIGN KEY ("scene_id") REFERENCES "public"."scene"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hide_all_characters_event" ADD CONSTRAINT "fk_hide_all_characters_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hide_cg_event" ADD CONSTRAINT "fk_hide_cg_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hide_character_event" ADD CONSTRAINT "fk_hide_character_event_character" FOREIGN KEY ("character_id") REFERENCES "public"."character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hide_character_event" ADD CONSTRAINT "fk_hide_character_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hide_message_window_event" ADD CONSTRAINT "fk_hide_message_window_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "fk_like_game" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "fk_like_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "move_character_event" ADD CONSTRAINT "fk_move_character_event_character" FOREIGN KEY ("character_id") REFERENCES "public"."character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "move_character_event" ADD CONSTRAINT "fk_move_character_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene" ADD CONSTRAINT "fk_scene_game" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sound_effect_event" ADD CONSTRAINT "fk_sound_effect_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sound_effect_event" ADD CONSTRAINT "fk_sound_effect_event_sound" FOREIGN KEY ("sound_effect_id") REFERENCES "public"."asset"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_render_event" ADD CONSTRAINT "fk_text_render_event_event" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "fk_user_profile_user" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_asset_owner_id" ON "asset" USING btree ("owner_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_asset_game_asset_id" ON "asset_game" USING btree ("asset_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_asset_game_game_id" ON "asset_game" USING btree ("game_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_change_background_event_background_id" ON "change_background_event" USING btree ("background_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_character_owner_id" ON "character" USING btree ("owner_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_character_asset_asset_id" ON "character_asset" USING btree ("asset_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_character_asset_character_id" ON "character_asset" USING btree ("character_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_character_game_character_id" ON "character_game" USING btree ("character_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_character_game_game_id" ON "character_game" USING btree ("game_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_choice_choice_scene_id" ON "choice" USING btree ("choice_scene_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_choice_next_scene_id" ON "choice" USING btree ("next_scene_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_comment_game_id" ON "comment" USING btree ("game_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_comment_user_id" ON "comment" USING btree ("user_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_end_scene_scene_id" ON "end_scene" USING btree ("scene_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_event_scene_id" ON "event" USING btree ("scene_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_game_user_id" ON "game" USING btree ("user_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_game_category_relation_category_id" ON "game_category_relation" USING btree ("game_category_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_game_category_relation_game_id" ON "game_category_relation" USING btree ("game_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_game_initial_scene_scene_id" ON "game_initial_scene" USING btree ("scene_id" int4_ops);--> statement-breakpoint
CREATE INDEX "game_play_game_id_idx" ON "game_play" USING btree ("game_id" int4_ops);--> statement-breakpoint
CREATE INDEX "game_play_user_id_idx" ON "game_play" USING btree ("user_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_goto_scene_next_scene_id" ON "goto_scene" USING btree ("next_scene_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_goto_scene_scene_id" ON "goto_scene" USING btree ("scene_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_like_game_id" ON "like" USING btree ("game_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_like_user_id" ON "like" USING btree ("user_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_scene_game_id" ON "scene" USING btree ("game_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_user_profile_user_id" ON "user_profile" USING btree ("user_id" int4_ops);