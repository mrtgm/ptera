
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;



-- ユーザー関連テーブル
CREATE TABLE "User" (
    id VARCHAR(255) PRIMARY KEY,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false, -- MVPでは削除機能は実装しない
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "UserProfile" (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    bio TEXT,
    "avatarUrl" VARCHAR(255),
    "userId" VARCHAR(255) NOT NULL UNIQUE,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX idx_user_profile_user_id ON "UserProfile"("userId");

-- アセット関連テーブル
CREATE TABLE "Asset" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "ownerId" VARCHAR(255),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    type VARCHAR(50) NOT NULL CHECK (type IN ('bgm', 'soundEffect', 'characterImage', 'backgroundImage', 'cg')),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    metadata JSONB,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("ownerId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX idx_asset_owner_id ON "Asset"("ownerId");

-- キャラクター関連テーブル
CREATE TABLE "Character" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "ownerId" VARCHAR(255),
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    name VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("ownerId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX idx_character_owner_id ON "Character"("ownerId");

CREATE TABLE "CharacterAsset" (
    id VARCHAR(255) PRIMARY KEY,
    "characterId" VARCHAR(255) NOT NULL,
    "assetId" VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("characterId") REFERENCES "Character"(id) ON DELETE CASCADE,
    FOREIGN KEY ("assetId") REFERENCES "Asset"(id) ON DELETE CASCADE
);
CREATE INDEX idx_character_asset_character_id ON "CharacterAsset"("characterId");
CREATE INDEX idx_character_asset_asset_id ON "CharacterAsset"("assetId");

-- ゲーム関連テーブル
CREATE TABLE "Scene" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "gameId" VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_scene_game_id ON "Scene"("gameId");

CREATE TABLE "Game" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "userId" VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    "coverImageUrl" VARCHAR(255),
    "releaseDate" TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX idx_game_user_id ON "Game"("userId");

CREATE TABLE "GameInitialScene" (
    "gameId" VARCHAR(255) PRIMARY KEY,
    "sceneId" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("gameId") REFERENCES "Game"(id) ON DELETE CASCADE,
    FOREIGN KEY ("sceneId") REFERENCES "Scene"(id) ON DELETE RESTRICT,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_game_initial_scene_scene_id ON "GameInitialScene"("sceneId");

-- Sceneテーブルの外部キー制約を追加（後から追加）
ALTER TABLE "Scene" ADD CONSTRAINT "fk_scene_game"
    FOREIGN KEY ("gameId") REFERENCES "Game"(id) ON DELETE CASCADE;

-- シーン派生テーブル
CREATE TABLE "ChoiceScene" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "sceneId" VARCHAR(255) NOT NULL UNIQUE,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sceneId") REFERENCES "Scene"(id) ON DELETE CASCADE
);

CREATE TABLE "GotoScene" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "sceneId" VARCHAR(255) NOT NULL UNIQUE,
    "nextSceneId" VARCHAR(255),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sceneId") REFERENCES "Scene"(id) ON DELETE CASCADE,
    FOREIGN KEY ("nextSceneId") REFERENCES "Scene"(id) ON DELETE SET NULL
);
CREATE INDEX idx_goto_scene_next_scene_id ON "GotoScene"("nextSceneId");
CREATE INDEX idx_goto_scene_scene_id ON "GotoScene"("sceneId");

CREATE TABLE "EndScene" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "sceneId" VARCHAR(255) NOT NULL UNIQUE,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sceneId") REFERENCES "Scene"(id) ON DELETE CASCADE
);
CREATE INDEX idx_end_scene_scene_id ON "EndScene"("sceneId");

CREATE TABLE "Choice" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "choiceSceneId" VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    "nextSceneId" VARCHAR(255),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("choiceSceneId") REFERENCES "ChoiceScene"(id) ON DELETE CASCADE,
    FOREIGN KEY ("nextSceneId") REFERENCES "Scene"(id) ON DELETE SET NULL
);
CREATE INDEX idx_choice_next_scene_id ON "Choice"("nextSceneId");
CREATE INDEX idx_choice_choice_scene_id ON "Choice"("choiceSceneId");


-- コメント・いいね
CREATE TABLE "Comment" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "gameId" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("gameId") REFERENCES "Game"(id) ON DELETE CASCADE
);
CREATE INDEX idx_comment_game_id ON "Comment"("gameId");
CREATE INDEX idx_comment_user_id ON "Comment"("userId");


CREATE TABLE "Like" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    "gameId" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("gameId") REFERENCES "Game"(id) ON DELETE CASCADE,
    UNIQUE ("gameId", "userId")
);
CREATE INDEX idx_like_game_id ON "Like"("gameId");
CREATE INDEX idx_like_user_id ON "Like"("userId");

-- カテゴリ
CREATE TABLE "GameCategory" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "GameCategoryRelation" (
    id VARCHAR(255) PRIMARY KEY,
    "gameId" VARCHAR(255) NOT NULL,
    "gameCategoryId" VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("gameId") REFERENCES "Game"(id) ON DELETE CASCADE,
    FOREIGN KEY ("gameCategoryId") REFERENCES "GameCategory"(id) ON DELETE CASCADE,
    UNIQUE ("gameId", "gameCategoryId")
);
CREATE INDEX idx_game_category_relation_game_id ON "GameCategoryRelation"("gameId");
CREATE INDEX idx_game_category_relation_category_id ON "GameCategoryRelation"("gameCategoryId");

-- イベント関連テーブル
CREATE TABLE "Event" (
    id VARCHAR(255) PRIMARY KEY,
    "sceneId" VARCHAR(255) NOT NULL,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    "orderIndex" VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sceneId") REFERENCES "Scene"(id) ON DELETE CASCADE
);
CREATE INDEX idx_event_scene_id ON "Event"("sceneId");


CREATE TABLE "EventCategory" (
    id VARCHAR(255) PRIMARY KEY,
    "publicId" UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "EventCategoryRelation" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL,
    "eventCategoryId" VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("eventCategoryId") REFERENCES "EventCategory"(id) ON DELETE CASCADE,
    UNIQUE ("eventId", "eventCategoryId")
);
CREATE INDEX idx_event_category_relation_event_id ON "EventCategoryRelation"("eventId");
CREATE INDEX idx_event_category_relation_category_id ON "EventCategoryRelation"("eventCategoryId");


-- イベント派生テーブル
CREATE TABLE "ChangeBackgroundEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "backgroundId" VARCHAR(255) NOT NULL,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("backgroundId") REFERENCES "Asset"(id) ON DELETE CASCADE
);
CREATE INDEX idx_change_background_event_background_id ON "ChangeBackgroundEvent"("backgroundId");

CREATE TABLE "AppearCharacterEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "characterId" VARCHAR(255) NOT NULL,
    "characterImageId" VARCHAR(255) NOT NULL,
    position POINT NOT NULL,
    scale NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("characterId") REFERENCES "Character"(id) ON DELETE CASCADE,
    FOREIGN KEY ("characterImageId") REFERENCES "Asset"(id) ON DELETE CASCADE
);

CREATE TABLE "HideCharacterEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "characterId" VARCHAR(255) NOT NULL,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("characterId") REFERENCES "Character"(id) ON DELETE CASCADE
);

CREATE TABLE "HideAllCharactersEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE
);

CREATE TABLE "MoveCharacterEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "characterId" VARCHAR(255) NOT NULL,
    position POINT NOT NULL,
    scale NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("characterId") REFERENCES "Character"(id) ON DELETE CASCADE
);

CREATE TABLE "CharacterEffectEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "characterId" VARCHAR(255) NOT NULL,
    "effectType" VARCHAR(50) NOT NULL,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("characterId") REFERENCES "Character"(id) ON DELETE CASCADE
);

CREATE TABLE "BGMStartEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "bgmId" VARCHAR(255) NOT NULL,
    loop BOOLEAN NOT NULL DEFAULT true,
    volume NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("bgmId") REFERENCES "Asset"(id) ON DELETE CASCADE
);

CREATE TABLE "BGMStopEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE
);

CREATE TABLE "SoundEffectEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "soundEffectId" VARCHAR(255) NOT NULL,
    volume NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
    loop BOOLEAN NOT NULL DEFAULT false,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("soundEffectId") REFERENCES "Asset"(id) ON DELETE CASCADE
);

CREATE TABLE "AppearCGEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "cgImageId" VARCHAR(255) NOT NULL,
    position POINT NOT NULL,
    scale NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE,
    FOREIGN KEY ("cgImageId") REFERENCES "Asset"(id) ON DELETE CASCADE
);

CREATE TABLE "HideCGEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE
);

CREATE TABLE "TextRenderEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    text TEXT NOT NULL,
    "characterName" VARCHAR(255),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE
);

CREATE TABLE "AppearMessageWindowEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE
);

CREATE TABLE "HideMessageWindowEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE
);

CREATE TABLE "EffectEvent" (
    id VARCHAR(255) PRIMARY KEY,
    "eventId" VARCHAR(255) NOT NULL UNIQUE,
    "effectType" VARCHAR(50) NOT NULL,
    "transitionDuration" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event"(id) ON DELETE CASCADE
);
