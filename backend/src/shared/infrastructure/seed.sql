-- ユーザーデータ
INSERT INTO "User" (id, "isDeleted", "publicId", "updatedAt", "createdAt") VALUES
('user1', false, gen_random_uuid(), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user2', false, gen_random_uuid(), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user3', false, gen_random_uuid(), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ユーザープロフィールデータ
INSERT INTO "UserProfile" (id, name, email, bio, "avatarUrl", "userId", "updatedAt", "createdAt") VALUES
('profile1', '田中太郎', 'tanaka@example.com', 'ビジュアルノベル制作が趣味です。', 'https://example.com/avatars/tanaka.jpg', 'user1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('profile2', '鈴木花子', 'suzuki@example.com', 'ゲームシナリオライターです。', 'https://example.com/avatars/suzuki.jpg', 'user2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('profile3', '佐藤次郎', 'sato@example.com', 'イラストレーターとして活動しています。', 'https://example.com/avatars/sato.jpg', 'user3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- アセットデータ
INSERT INTO "Asset" (id, "publicId", "ownerId", "isPublic", type, name, url, metadata, "updatedAt", "createdAt") VALUES
-- 背景画像
('asset1', gen_random_uuid(), 'user1', true, 'backgroundImage', '教室', 'https://example.com/assets/classroom.jpg', '{"width": 1920, "height": 1080}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('asset2', gen_random_uuid(), 'user1', true, 'backgroundImage', '公園', 'https://example.com/assets/park.jpg', '{"width": 1920, "height": 1080}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('asset3', gen_random_uuid(), 'user2', true, 'backgroundImage', '街中', 'https://example.com/assets/city.jpg', '{"width": 1920, "height": 1080}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- キャラクター画像
('asset4', gen_random_uuid(), 'user1', true, 'characterImage', '主人公_通常', 'https://example.com/assets/protagonist_normal.png', '{"width": 600, "height": 1200}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('asset5', gen_random_uuid(), 'user1', true, 'characterImage', '主人公_笑顔', 'https://example.com/assets/protagonist_smile.png', '{"width": 600, "height": 1200}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('asset6', gen_random_uuid(), 'user2', true, 'characterImage', 'ヒロイン_通常', 'https://example.com/assets/heroine_normal.png', '{"width": 600, "height": 1200}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('asset7', gen_random_uuid(), 'user2', true, 'characterImage', 'ヒロイン_笑顔', 'https://example.com/assets/heroine_smile.png', '{"width": 600, "height": 1200}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- BGM
('asset8', gen_random_uuid(), 'user3', true, 'bgm', '日常BGM', 'https://example.com/assets/daily_bgm.mp3', '{"duration": 180}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('asset9', gen_random_uuid(), 'user3', true, 'bgm', '緊張BGM', 'https://example.com/assets/tension_bgm.mp3', '{"duration": 120}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 効果音
('asset10', gen_random_uuid(), 'user3', true, 'soundEffect', 'ドア開閉音', 'https://example.com/assets/door_sound.mp3', '{"duration": 3}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('asset11', gen_random_uuid(), 'user3', true, 'soundEffect', '足音', 'https://example.com/assets/footstep.mp3', '{"duration": 2}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- CG
('asset12', gen_random_uuid(), 'user1', true, 'cg', 'エンディングCG', 'https://example.com/assets/ending_cg.jpg', '{"width": 1920, "height": 1080}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- キャラクターデータ
INSERT INTO "Character" (id, "publicId", "ownerId", "isPublic", name, "updatedAt", "createdAt") VALUES
('char1', gen_random_uuid(), 'user1', true, '主人公', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('char2', gen_random_uuid(), 'user2', true, 'ヒロイン', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('char3', gen_random_uuid(), 'user2', true, '親友', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- キャラクターアセット関連付け
INSERT INTO "CharacterAsset" (id, "characterId", "assetId", "updatedAt", "createdAt") VALUES
('charAsset1', 'char1', 'asset4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('charAsset2', 'char1', 'asset5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('charAsset3', 'char2', 'asset6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('charAsset4', 'char2', 'asset7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ゲームカテゴリ
INSERT INTO "GameCategory" (id, "publicId", name, "updatedAt", "createdAt") VALUES
('cat1', gen_random_uuid(), '恋愛', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat2', gen_random_uuid(), 'ミステリー', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat3', gen_random_uuid(), 'ファンタジー', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat4', gen_random_uuid(), '日常', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cat5', gen_random_uuid(), 'ホラー', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- イベントカテゴリ
INSERT INTO "EventCategory" (id, "publicId", name, "updatedAt", "createdAt") VALUES
('ecat1', gen_random_uuid(), 'メインストーリー', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ecat2', gen_random_uuid(), 'サブストーリー', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ecat3', gen_random_uuid(), 'エンディング', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ゲーム作成
INSERT INTO "Game" (id, "publicId", "userId", name, description, "coverImageUrl", status, "updatedAt", "createdAt") VALUES
('game1', gen_random_uuid(), 'user1', '青春物語', '高校生活を送る主人公の物語', 'https://example.com/covers/game1.jpg', 'published', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('game2', gen_random_uuid(), 'user2', '謎解きアドベンチャー', '古い洋館に隠された謎を解き明かそう', 'https://example.com/covers/game2.jpg', 'draft', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ゲームカテゴリ関連付け
INSERT INTO "GameCategoryRelation" (id, "gameId", "gameCategoryId", "updatedAt", "createdAt") VALUES
('gcrel1', 'game1', 'cat1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('gcrel2', 'game1', 'cat4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('gcrel3', 'game2', 'cat2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('gcrel4', 'game2', 'cat5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- シーン作成
INSERT INTO "Scene" (id, "publicId", "gameId", title, "updatedAt", "createdAt") VALUES
-- game1のシーン
('scene1', gen_random_uuid(), 'game1', 'プロローグ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('scene2', gen_random_uuid(), 'game1', '教室', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('scene3', gen_random_uuid(), 'game1', '公園', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('scene4', gen_random_uuid(), 'game1', 'エンディング1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('scene5', gen_random_uuid(), 'game1', 'エンディング2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- game2のシーン
('scene6', gen_random_uuid(), 'game2', '洋館の入り口', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('scene7', gen_random_uuid(), 'game2', '応接室', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('scene8', gen_random_uuid(), 'game2', '地下室', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 初期シーンを設定
INSERT INTO "GameInitialScene" ("gameId", "sceneId", "updatedAt", "createdAt") VALUES
('game1', 'scene1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('game2', 'scene6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- シーン派生テーブル
-- ゴーシーン
INSERT INTO "GotoScene" (id, "publicId", "sceneId", "nextSceneId", "updatedAt", "createdAt") VALUES
('goto1', gen_random_uuid(), 'scene1', 'scene2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('goto2', gen_random_uuid(), 'scene6', 'scene7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 選択肢シーン
INSERT INTO "ChoiceScene" (id, "publicId", "sceneId", "updatedAt", "createdAt") VALUES
('choice1', gen_random_uuid(), 'scene2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('choice2', gen_random_uuid(), 'scene7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 選択肢
INSERT INTO "Choice" (id, "publicId", "choiceSceneId", text, "nextSceneId", "updatedAt", "createdAt") VALUES
('choice_opt1', gen_random_uuid(), 'choice1', '公園に行く', 'scene3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('choice_opt2', gen_random_uuid(), 'choice1', '教室に残る', 'scene4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('choice_opt3', gen_random_uuid(), 'choice2', '地下室を調べる', 'scene8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('choice_opt4', gen_random_uuid(), 'choice2', '外に逃げる', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- エンドシーン
INSERT INTO "EndScene" (id, "publicId", "sceneId", "updatedAt", "createdAt") VALUES
('end1', gen_random_uuid(), 'scene4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('end2', gen_random_uuid(), 'scene5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('end3', gen_random_uuid(), 'scene8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- イベント
-- scene1(プロローグ)のイベント
INSERT INTO "Event" (id, "sceneId", "publicId", type, "orderIndex", "updatedAt", "createdAt") VALUES
('event1', 'scene1', gen_random_uuid(), 'backgroundChange', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event2', 'scene1', gen_random_uuid(), 'bgmStart', '2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event3', 'scene1', gen_random_uuid(), 'textRender', '3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event4', 'scene1', gen_random_uuid(), 'characterAppear', '4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event5', 'scene1', gen_random_uuid(), 'textRender', '5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- scene2(教室)のイベント
INSERT INTO "Event" (id, "sceneId", "publicId", type, "orderIndex", "updatedAt", "createdAt") VALUES
('event6', 'scene2', gen_random_uuid(), 'backgroundChange', '1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event7', 'scene2', gen_random_uuid(), 'characterAppear', '2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event8', 'scene2', gen_random_uuid(), 'textRender', '3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event9', 'scene2', gen_random_uuid(), 'characterAppear', '4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('event10', 'scene2', gen_random_uuid(), 'textRender', '5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- イベントカテゴリ関連付け
INSERT INTO "EventCategoryRelation" (id, "eventId", "eventCategoryId", "updatedAt", "createdAt") VALUES
('ecrel1', 'event1', 'ecat1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ecrel2', 'event2', 'ecat1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ecrel3', 'event6', 'ecat1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ecrel4', 'event7', 'ecat1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- イベント派生テーブル
-- 背景変更イベント
INSERT INTO "ChangeBackgroundEvent" (id, "eventId", "backgroundId", "transitionDuration", "updatedAt", "createdAt") VALUES
('bgChange1', 'event1', 'asset1', 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('bgChange2', 'event6', 'asset1', 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- BGM開始イベント
INSERT INTO "BGMStartEvent" (id, "eventId", "bgmId", loop, volume, "transitionDuration", "updatedAt", "createdAt") VALUES
('bgmStart1', 'event2', 'asset8', true, 0.8, 2000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- テキスト表示イベント
INSERT INTO "TextRenderEvent" (id, "eventId", text, "characterName", "updatedAt", "createdAt") VALUES
('text1', 'event3', 'これは物語の始まりです。', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('text2', 'event5', 'やあ、久しぶり。今日はいい天気だね。', '主人公', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('text3', 'event8', '教室に来たけど、誰もいないね。', '主人公', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('text4', 'event10', 'あ、いたの？ごめんね、気づかなかった。', 'ヒロイン', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- キャラクター登場イベント
INSERT INTO "AppearCharacterEvent" (id, "eventId", "characterId", "characterImageId", position, scale, "transitionDuration", "updatedAt", "createdAt") VALUES
('charAppear1', 'event4', 'char1', 'asset4', point(0.3, 0.8), 1.0, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('charAppear2', 'event7', 'char1', 'asset5', point(0.3, 0.8), 1.0, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('charAppear3', 'event9', 'char2', 'asset6', point(0.7, 0.8), 1.0, 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- コメント
INSERT INTO "Comment" (id, "publicId", "gameId", "userId", content, "updatedAt", "createdAt") VALUES
('comment1', gen_random_uuid(), 'game1', 'user2', 'とても面白いゲームでした！', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('comment2', gen_random_uuid(), 'game1', 'user3', 'ストーリーが感動的で良かったです。', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- いいね
INSERT INTO "Like" (id, "publicId", "gameId", "userId", "updatedAt", "createdAt") VALUES
('like1', gen_random_uuid(), 'game1', 'user2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('like2', gen_random_uuid(), 'game1', 'user3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
