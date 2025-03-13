-- ユーザー関連テーブル
CREATE TABLE "user" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    is_deleted BOOLEAN NOT NULL DEFAULT false, -- MVPでは削除機能は実装しない
    jwt_sub VARCHAR(255) NOT NULL UNIQUE, -- CognitoのユーザーID (sub)
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user_profile" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    user_id INT NOT NULL UNIQUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profile_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_profile_user_id ON "user_profile"(user_id);

-- アセット関連テーブル
CREATE TABLE "asset" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    owner_id INT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    asset_type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    metadata JSONB,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_owner FOREIGN KEY (owner_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT asset_type_check CHECK ("asset_type" IN ('bgm', 'soundEffect', 'characterImage', 'backgroundImage', 'cgImage'))
);
CREATE INDEX idx_asset_owner_id ON "asset"(owner_id);


-- キャラクター関連テーブル
CREATE TABLE "character" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    owner_id INT,
    is_public BOOLEAN NOT NULL DEFAULT false,
    name VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_character_owner FOREIGN KEY (owner_id) REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX idx_character_owner_id ON "character"(owner_id);

CREATE TABLE "character_asset" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    character_id INT NOT NULL,
    asset_id INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_character_asset_character FOREIGN KEY (character_id) REFERENCES "character"(id) ON DELETE CASCADE,
    CONSTRAINT fk_character_asset_asset FOREIGN KEY (asset_id) REFERENCES "asset"(id) ON DELETE CASCADE
);
CREATE INDEX idx_character_asset_character_id ON "character_asset"(character_id);
CREATE INDEX idx_character_asset_asset_id ON "character_asset"(asset_id);

-- ゲーム関連テーブル
CREATE TABLE "scene" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    game_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_scene_game_id ON "scene"(game_id);

CREATE TABLE "game" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(255),
    release_date TIMESTAMP,
    "status" VARCHAR(20) NOT NULL CHECK ("status" IN ('draft', 'published', 'archived')),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX idx_game_user_id ON "game"(user_id);

CREATE TABLE "game_play" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INT NOT NULL,
    user_id INT,
    guest_id UUID UNIQUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game_play_game FOREIGN KEY (game_id) REFERENCES "game"(id) ON DELETE CASCADE,
    CONSTRAINT fk_game_play_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX game_play_game_id_idx ON "game_play"(game_id);
CREATE INDEX game_play_user_id_idx ON "game_play"(user_id);

CREATE TABLE "game_initial_scene" (
    game_id INT PRIMARY KEY,
    scene_id INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game_initial_scene_game FOREIGN KEY (game_id) REFERENCES "game"(id) ON DELETE CASCADE,
    CONSTRAINT fk_game_initial_scene_scene FOREIGN KEY (scene_id) REFERENCES "scene"(id) ON DELETE RESTRICT
);
CREATE INDEX idx_game_initial_scene_scene_id ON "game_initial_scene"(scene_id);


-- sceneテーブルの外部キー制約
ALTER TABLE "scene" ADD CONSTRAINT fk_scene_game
    FOREIGN KEY (game_id) REFERENCES "game"(id) ON DELETE CASCADE;

-- シーン派生テーブル
CREATE TABLE "choice_scene" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    scene_id INT NOT NULL UNIQUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_choice_scene_scene FOREIGN KEY (scene_id) REFERENCES "scene"(id) ON DELETE CASCADE
);

CREATE TABLE "goto_scene" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    scene_id INT NOT NULL UNIQUE,
    next_scene_id INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goto_scene_scene FOREIGN KEY (scene_id) REFERENCES "scene"(id) ON DELETE CASCADE,
    CONSTRAINT fk_goto_scene_next_scene FOREIGN KEY (next_scene_id) REFERENCES "scene"(id) ON DELETE SET NULL
);
CREATE INDEX idx_goto_scene_next_scene_id ON "goto_scene"(next_scene_id);
CREATE INDEX idx_goto_scene_scene_id ON "goto_scene"(scene_id);

CREATE TABLE "end_scene" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    scene_id INT NOT NULL UNIQUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_end_scene_scene FOREIGN KEY (scene_id) REFERENCES "scene"(id) ON DELETE CASCADE
);
CREATE INDEX idx_end_scene_scene_id ON "end_scene"(scene_id);

CREATE TABLE "choice" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    choice_scene_id INT NOT NULL,
    "text" TEXT NOT NULL,
    next_scene_id INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_choice_choice_scene FOREIGN KEY (choice_scene_id) REFERENCES "choice_scene"(id) ON DELETE CASCADE,
    CONSTRAINT fk_choice_next_scene FOREIGN KEY (next_scene_id) REFERENCES "scene"(id) ON DELETE SET NULL
);
CREATE INDEX idx_choice_next_scene_id ON "choice"(next_scene_id);
CREATE INDEX idx_choice_choice_scene_id ON "choice"(choice_scene_id);

-- ゲームとアセットの関連テーブル
CREATE TABLE "asset_game" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    asset_id INT NOT NULL,
    game_id INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_asset_game_asset FOREIGN KEY (asset_id) REFERENCES "asset"(id) ON DELETE CASCADE,
    CONSTRAINT fk_asset_game_game FOREIGN KEY (game_id) REFERENCES "game"(id) ON DELETE CASCADE,
    CONSTRAINT uq_asset_game UNIQUE (asset_id, game_id)
);
CREATE INDEX idx_asset_game_asset_id ON "asset_game"(asset_id);
CREATE INDEX idx_asset_game_game_id ON "asset_game"(game_id);

CREATE TABLE "character_game" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    character_id INT NOT NULL,
    game_id INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_character_game_character FOREIGN KEY (character_id) REFERENCES "character"(id) ON DELETE CASCADE,
    CONSTRAINT fk_character_game_game FOREIGN KEY (game_id) REFERENCES "game"(id) ON DELETE CASCADE
    CONSTRAINT uq_character_game UNIQUE (character_id, game_id)
);
CREATE INDEX idx_character_game_character_id ON "character_game"(character_id);
CREATE INDEX idx_character_game_game_id ON "character_game"(game_id);

-- コメント・いいね
CREATE TABLE "comment" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_game FOREIGN KEY (game_id) REFERENCES "game"(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
);
CREATE INDEX idx_comment_game_id ON "comment"(game_id);
CREATE INDEX idx_comment_user_id ON "comment"(user_id);

CREATE TABLE "like" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_like_game FOREIGN KEY (game_id) REFERENCES "game"(id) ON DELETE CASCADE,
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    UNIQUE (game_id, user_id)
);
CREATE INDEX idx_like_game_id ON "like"(game_id);
CREATE INDEX idx_like_user_id ON "like"(user_id);

-- カテゴリ
CREATE TABLE "game_category" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "game_category_relation" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INT NOT NULL,
    game_category_id INT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game_category_relation_game FOREIGN KEY (game_id) REFERENCES "game"(id) ON DELETE CASCADE,
    CONSTRAINT fk_game_category_relation_category FOREIGN KEY (game_category_id) REFERENCES "game_category"(id) ON DELETE CASCADE,
    CONSTRAINT uq_game_category_relation UNIQUE (game_id, game_category_id)
);
CREATE INDEX idx_game_category_relation_game_id ON "game_category_relation"(game_id);
CREATE INDEX idx_game_category_relation_category_id ON "game_category_relation"(game_category_id);

-- イベント関連テーブル
CREATE TABLE "event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    scene_id INT NOT NULL,
    public_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    order_index VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_scene FOREIGN KEY (scene_id) REFERENCES "scene"(id) ON DELETE CASCADE
);
CREATE INDEX idx_event_scene_id ON "event"(scene_id);


-- イベント派生テーブル
CREATE TABLE "change_background_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    background_id INT NOT NULL,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_change_background_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_change_background_event_background FOREIGN KEY (background_id) REFERENCES "asset"(id) ON DELETE CASCADE
);
CREATE INDEX idx_change_background_event_background_id ON "change_background_event"(background_id);

CREATE TABLE "appear_character_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    character_id INT NOT NULL,
    character_image_id INT NOT NULL,
    position POINT NOT NULL,
    scale NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appear_character_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_appear_character_event_character FOREIGN KEY (character_id) REFERENCES "character"(id) ON DELETE CASCADE,
    CONSTRAINT fk_appear_character_event_image FOREIGN KEY (character_image_id) REFERENCES "asset"(id) ON DELETE CASCADE
);

CREATE TABLE "hide_character_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    character_id INT NOT NULL,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hide_character_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_hide_character_event_character FOREIGN KEY (character_id) REFERENCES "character"(id) ON DELETE CASCADE
);

CREATE TABLE "hide_all_characters_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hide_all_characters_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE
);

CREATE TABLE "move_character_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    character_id INT NOT NULL,
    position POINT NOT NULL,
    scale NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_move_character_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_move_character_event_character FOREIGN KEY (character_id) REFERENCES "character"(id) ON DELETE CASCADE
);

CREATE TABLE "character_effect_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    character_id INT NOT NULL,
    effect_type VARCHAR(50) NOT NULL,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_character_effect_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_character_effect_event_character FOREIGN KEY (character_id) REFERENCES "character"(id) ON DELETE CASCADE
);

CREATE TABLE "bgm_start_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    bgm_id INT NOT NULL,
    "loop" BOOLEAN NOT NULL DEFAULT true,
    volume NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bgm_start_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_bgm_start_event_bgm FOREIGN KEY (bgm_id) REFERENCES "asset"(id) ON DELETE CASCADE
);

CREATE TABLE "bgm_stop_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bgm_stop_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE
);

CREATE TABLE "sound_effect_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    sound_effect_id INT NOT NULL,
    volume NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
    "loop" BOOLEAN NOT NULL DEFAULT false,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sound_effect_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_sound_effect_event_sound FOREIGN KEY (sound_effect_id) REFERENCES "asset"(id) ON DELETE CASCADE
);

CREATE TABLE "appear_cg_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    cg_image_id INT NOT NULL,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appear_cg_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE,
    CONSTRAINT fk_appear_cg_event_image FOREIGN KEY (cg_image_id) REFERENCES "asset"(id) ON DELETE CASCADE
);

CREATE TABLE "hide_cg_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hide_cg_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE
);

CREATE TABLE "text_render_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    "text" TEXT NOT NULL,
    character_name VARCHAR(255),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_text_render_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE
);

CREATE TABLE "appear_message_window_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appear_message_window_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE
);

CREATE TABLE "hide_message_window_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hide_message_window_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE
);

CREATE TABLE "effect_event" (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id INT NOT NULL UNIQUE,
    effect_type VARCHAR(50) NOT NULL,
    transition_duration INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_effect_event_event FOREIGN KEY (event_id) REFERENCES "event"(id) ON DELETE CASCADE
);
