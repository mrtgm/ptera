import { db } from "./";
import * as schema from "./schema"; // あなたのスキーマ定義ファイルをインポート

async function seedDatabase() {
	try {
		// 既存データの削除
		await db.delete(schema.effectEvent);
		await db.delete(schema.hideMessageWindowEvent);
		await db.delete(schema.appearMessageWindowEvent);
		await db.delete(schema.textRenderEvent);
		await db.delete(schema.hideCgEvent);
		await db.delete(schema.appearCgEvent);
		await db.delete(schema.soundEffectEvent);
		await db.delete(schema.bgmStopEvent);
		await db.delete(schema.bgmStartEvent);
		await db.delete(schema.characterEffectEvent);
		await db.delete(schema.moveCharacterEvent);
		await db.delete(schema.hideAllCharactersEvent);
		await db.delete(schema.hideCharacterEvent);
		await db.delete(schema.appearCharacterEvent);
		await db.delete(schema.changeBackgroundEvent);
		await db.delete(schema.event);
		await db.delete(schema.gameCategoryRelation);
		await db.delete(schema.like);
		await db.delete(schema.comment);
		await db.delete(schema.choice);
		await db.delete(schema.endScene);
		await db.delete(schema.gotoScene);
		await db.delete(schema.choiceScene);
		await db.delete(schema.gameInitialScene);
		await db.delete(schema.scene);
		await db.delete(schema.gamePlay);
		await db.delete(schema.assetGame);
		await db.delete(schema.characterGame);
		await db.delete(schema.game);
		await db.delete(schema.gameCategory);
		await db.delete(schema.characterAsset);
		await db.delete(schema.character);
		await db.delete(schema.asset);
		await db.delete(schema.userProfile);
		await db.delete(schema.user);
		console.log("✅ 既存データのクリアが完了しました");

		// ユーザーデータの挿入
		const users = await db
			.insert(schema.user)
			.values([
				{ jwtSub: "auth0|user1", isDeleted: false },
				{ jwtSub: "auth0|user2", isDeleted: false },
				{ jwtSub: "auth0|user3", isDeleted: false },
				{ jwtSub: "auth0|admin", isDeleted: false },
			])
			.returning();

		// ユーザープロフィールの挿入
		await db.insert(schema.userProfile).values([
			{
				name: "User 1",
				bio: "Regular user with a passion for visual novels",
				userId: users[0].id,
				avatarUrl: "https://example.com/avatar1.png",
			},
			{
				name: "User 2",
				bio: "Game creator and storyteller",
				userId: users[1].id,
				avatarUrl: "https://example.com/avatar2.png",
			},
			{
				name: "User 3",
				bio: "New to visual novels but excited to create",
				userId: users[2].id,
				avatarUrl: "https://example.com/avatar3.png",
			},
			{
				name: "Admin",
				bio: "Administrator and content curator",
				userId: users[3].id,
				avatarUrl: "https://example.com/avatar4.png",
			},
		]);

		// アセットデータの挿入（増量）
		const assets = await db
			.insert(schema.asset)
			.values([
				// キャラクター画像
				{
					ownerId: users[0].id,
					isPublic: true,
					assetType: "characterImage",
					name: "主人公（男性）",
					url: "https://example.com/images/char1.png",
					metadata: {
						tags: ["主人公", "男性"],
						description: "主人公のイメージ",
					},
				},
				{
					ownerId: users[0].id,
					isPublic: true,
					assetType: "characterImage",
					name: "ヒロイン",
					url: "https://example.com/images/char2.png",
					metadata: {
						tags: ["ヒロイン", "女性"],
						description: "ヒロインのイメージ",
					},
				},
				{
					ownerId: users[1].id,
					isPublic: true,
					assetType: "characterImage",
					name: "ライバル",
					url: "https://example.com/images/char3.png",
					metadata: {
						tags: ["ライバル", "男性"],
						description: "ライバルのイメージ",
					},
				},
				{
					ownerId: users[2].id,
					isPublic: true,
					assetType: "characterImage",
					name: "幼なじみ",
					url: "https://example.com/images/char4.png",
					metadata: {
						tags: ["友人", "女性"],
						description: "幼なじみのイメージ",
					},
				},
				// 背景画像
				{
					ownerId: users[0].id,
					isPublic: true,
					assetType: "backgroundImage",
					name: "教室（昼）",
					url: "https://example.com/images/bg_classroom_day.jpg",
					metadata: { tags: ["室内", "昼"], description: "昼間の教室の背景" },
				},
				{
					ownerId: users[0].id,
					isPublic: true,
					assetType: "backgroundImage",
					name: "教室（夕方）",
					url: "https://example.com/images/bg_classroom_evening.jpg",
					metadata: { tags: ["室内", "夕方"], description: "夕方の教室の背景" },
				},
				{
					ownerId: users[1].id,
					isPublic: true,
					assetType: "backgroundImage",
					name: "公園",
					url: "https://example.com/images/bg_park.jpg",
					metadata: { tags: ["屋外", "昼"], description: "公園の背景" },
				},
				{
					ownerId: users[2].id,
					isPublic: true,
					assetType: "backgroundImage",
					name: "カフェ",
					url: "https://example.com/images/bg_cafe.jpg",
					metadata: { tags: ["室内", "昼"], description: "カフェの背景" },
				},
				// BGm
				{
					ownerId: users[1].id,
					isPublic: true,
					assetType: "bgm",
					name: "メインテーマ",
					url: "https://example.com/audio/main_theme.mp3",
					metadata: { length: "2:45", composer: "音楽太郎" },
				},
				{
					ownerId: users[2].id,
					isPublic: true,
					assetType: "bgm",
					name: "日常シーン",
					url: "https://example.com/audio/daily_life.mp3",
					metadata: { length: "3:10", composer: "音楽太郎" },
				},
				{
					ownerId: users[0].id,
					isPublic: true,
					assetType: "bgm",
					name: "感動シーン",
					url: "https://example.com/audio/emotional.mp3",
					metadata: { length: "4:20", composer: "音楽花子" },
				},
				// 効果音
				{
					ownerId: users[2].id,
					isPublic: true,
					assetType: "soundEffect",
					name: "ドア開閉音",
					url: "https://example.com/audio/door.wav",
					metadata: { category: "環境音" },
				},
				{
					ownerId: users[1].id,
					isPublic: true,
					assetType: "soundEffect",
					name: "足音",
					url: "https://example.com/audio/footsteps.wav",
					metadata: { category: "環境音" },
				},
				{
					ownerId: users[0].id,
					isPublic: true,
					assetType: "soundEffect",
					name: "衝撃音",
					url: "https://example.com/audio/impact.wav",
					metadata: { category: "演出" },
				},
				// CG
				{
					ownerId: users[2].id,
					isPublic: true,
					assetType: "cgImage",
					name: "出会いシーン",
					url: "https://example.com/images/event_meeting.jpg",
					metadata: {
						event: "出会いシーン",
						characters: ["主人公", "ヒロイン"],
					},
				},
				{
					ownerId: users[1].id,
					isPublic: true,
					assetType: "cgImage",
					name: "告白シーン",
					url: "https://example.com/images/event_confession.jpg",
					metadata: {
						event: "告白シーン",
						characters: ["主人公", "ヒロイン"],
					},
				},
			])
			.returning();

		const characters = await db
			.insert(schema.character)
			.values([
				{ ownerId: users[0].id, isPublic: true, name: "主人公" },
				{ ownerId: users[0].id, isPublic: true, name: "ヒロイン" },
				{ ownerId: users[1].id, isPublic: true, name: "ライバル" },
				{ ownerId: users[2].id, isPublic: true, name: "幼なじみ" },
				{ ownerId: users[3].id, isPublic: true, name: "先生" },
			])
			.returning();

		// キャラクターとアセットの関連付け
		await db.insert(schema.characterAsset).values([
			{ characterId: characters[0].id, assetId: assets[0].id },
			{ characterId: characters[1].id, assetId: assets[1].id },
			{ characterId: characters[2].id, assetId: assets[2].id },
			{ characterId: characters[3].id, assetId: assets[3].id },
		]);

		// ゲームカテゴリの挿入
		const categories = await db
			.insert(schema.gameCategory)
			.values([
				{ name: "アドベンチャー" },
				{ name: "ロマンス" },
				{ name: "ミステリー" },
				{ name: "ファンタジー" },
				{ name: "学園" },
				{ name: "SF" },
			])
			.returning();

		const games = await db
			.insert(schema.game)
			.values([
				{
					userId: users[0].id,
					name: "初めてのノベルゲーム",
					description:
						"高校を舞台にした青春ストーリー。主人公が新しい学校で出会った人々との交流を描きます。",
					coverImageUrl: "https://example.com/images/cover1.jpg",
					status: "published",
				},
				{
					userId: users[1].id,
					name: "謎解きアドベンチャー",
					description: "学校で起きた不思議な出来事を解明していくミステリー。",
					coverImageUrl: "https://example.com/images/cover2.jpg",
					status: "draft",
				},
				{
					userId: users[1].id,
					name: "恋の行方",
					description: "幼なじみとの再会から始まる恋愛ストーリー。",
					coverImageUrl: "https://example.com/images/cover3.jpg",
					status: "published",
				},
				{
					userId: users[2].id,
					name: "異世界冒険記",
					description: "主人公が異世界に召喚され、様々な冒険をする物語。",
					coverImageUrl: "https://example.com/images/cover4.jpg",
					status: "published",
				},
				{
					userId: users[3].id,
					name: "SF学園物語",
					description: "未来の学園を舞台にしたSFストーリー。",
					coverImageUrl: "https://example.com/images/cover5.jpg",
					status: "draft",
				},
			])
			.returning();

		// ゲームとカテゴリの関連付け
		await db.insert(schema.gameCategoryRelation).values([
			{ gameId: games[0].id, gameCategoryId: categories[0].id },
			{ gameId: games[0].id, gameCategoryId: categories[1].id },
			{ gameId: games[0].id, gameCategoryId: categories[4].id },
			{ gameId: games[1].id, gameCategoryId: categories[0].id },
			{ gameId: games[1].id, gameCategoryId: categories[2].id },
			{ gameId: games[2].id, gameCategoryId: categories[1].id },
			{ gameId: games[2].id, gameCategoryId: categories[4].id },
			{ gameId: games[3].id, gameCategoryId: categories[0].id },
			{ gameId: games[3].id, gameCategoryId: categories[3].id },
			{ gameId: games[4].id, gameCategoryId: categories[4].id },
			{ gameId: games[4].id, gameCategoryId: categories[5].id },
		]);

		console.log(assets[0].id, games[0].id);

		// 新規追加: ゲームとアセットの関連付け
		await db.insert(schema.assetGame).values([
			// ゲーム1のアセット
			{ assetId: assets[0].id, gameId: games[0].id }, // 主人公
			{ assetId: assets[1].id, gameId: games[0].id }, // ヒロイン
			{ assetId: assets[4].id, gameId: games[0].id }, // 教室（昼）
			{ assetId: assets[5].id, gameId: games[0].id }, // 教室（夕方）
			{ assetId: assets[8].id, gameId: games[0].id }, // BGM: メインテーマ
			{ assetId: assets[10].id, gameId: games[0].id }, // BGM: 感動シーン
			{ assetId: assets[11].id, gameId: games[0].id }, // 効果音: ドア開閉音

			// ゲーム2のアセット
			{ assetId: assets[0].id, gameId: games[1].id }, // 主人公
			{ assetId: assets[2].id, gameId: games[1].id }, // ライバル
			{ assetId: assets[4].id, gameId: games[1].id }, // 教室（昼）
			{ assetId: assets[5].id, gameId: games[1].id }, // 教室（夕方）
			{ assetId: assets[12].id, gameId: games[1].id }, // 効果音: 足音

			// ゲーム3のアセット
			{ assetId: assets[0].id, gameId: games[2].id }, // 主人公
			{ assetId: assets[1].id, gameId: games[2].id }, // ヒロイン
			{ assetId: assets[3].id, gameId: games[2].id }, // 幼なじみ
			{ assetId: assets[6].id, gameId: games[2].id }, // 公園
			{ assetId: assets[7].id, gameId: games[2].id }, // カフェ
			{ assetId: assets[9].id, gameId: games[2].id }, // BGM: 日常シーン
			{ assetId: assets[11].id, gameId: games[2].id }, // 効果音: ドア開閉音
			{ assetId: assets[15].id, gameId: games[2].id }, // CG: 告白シーン

			// ゲーム4のアセット
			{ assetId: assets[0].id, gameId: games[3].id }, // 主人公
			{ assetId: assets[2].id, gameId: games[3].id }, // ライバル
			{ assetId: assets[6].id, gameId: games[3].id }, // 公園
			{ assetId: assets[13].id, gameId: games[3].id }, // 効果音: 衝撃音
			{ assetId: assets[14].id, gameId: games[3].id }, // CG: 出会いシーン

			// ゲーム5のアセット
			{ assetId: assets[0].id, gameId: games[4].id }, // 主人公
			{ assetId: assets[3].id, gameId: games[4].id }, // 幼なじみ
			{ assetId: assets[4].id, gameId: games[4].id }, // 教室（昼）
			{ assetId: assets[5].id, gameId: games[4].id }, // 教室（夕方）
			{ assetId: assets[8].id, gameId: games[4].id }, // BGM: メインテーマ
			{ assetId: assets[13].id, gameId: games[4].id }, // 効果音: 衝撃音
		]);

		// 新規追加: ゲームとキャラクターの関連付け
		await db.insert(schema.characterGame).values([
			// ゲーム1のキャラクター
			{ characterId: characters[0].id, gameId: games[0].id }, // 主人公
			{ characterId: characters[1].id, gameId: games[0].id }, // ヒロイン

			// ゲーム2のキャラクター
			{ characterId: characters[0].id, gameId: games[1].id }, // 主人公
			{ characterId: characters[2].id, gameId: games[1].id }, // ライバル

			// ゲーム3のキャラクター
			{ characterId: characters[0].id, gameId: games[2].id }, // 主人公
			{ characterId: characters[1].id, gameId: games[2].id }, // ヒロイン
			{ characterId: characters[3].id, gameId: games[2].id }, // 幼なじみ

			// ゲーム4のキャラクター
			{ characterId: characters[0].id, gameId: games[3].id }, // 主人公
			{ characterId: characters[2].id, gameId: games[3].id }, // ライバル

			// ゲーム5のキャラクター
			{ characterId: characters[0].id, gameId: games[4].id }, // 主人公
			{ characterId: characters[3].id, gameId: games[4].id }, // 幼なじみ
			{ characterId: characters[4].id, gameId: games[4].id }, // 先生
		]);

		// シーンの挿入（各ゲームに複数シーン）
		const scenes = await db
			.insert(schema.scene)
			.values([
				// ゲーム1のシーン
				{ gameId: games[0].id, name: "導入シーン" },
				{ gameId: games[0].id, name: "登校シーン" },
				{ gameId: games[0].id, name: "選択肢シーン" },
				{ gameId: games[0].id, name: "エンディング" },

				// ゲーム2のシーン
				{ gameId: games[1].id, name: "序章" },
				{ gameId: games[1].id, name: "謎の発見" },
				{ gameId: games[1].id, name: "調査開始" },

				// ゲーム3のシーン
				{ gameId: games[2].id, name: "再会" },
				{ gameId: games[2].id, name: "カフェでの会話" },
				{ gameId: games[2].id, name: "告白シーン" },
				{ gameId: games[2].id, name: "エンディング" },

				// ゲーム4のシーン
				{ gameId: games[3].id, name: "異世界への召喚" },
				{ gameId: games[3].id, name: "仲間との出会い" },

				// ゲーム5のシーン
				{ gameId: games[4].id, name: "未来学園への入学" },
				{ gameId: games[4].id, name: "不思議な実験" },
			])
			.returning();

		// プレイカウントの挿入
		await db.insert(schema.gamePlay).values([
			{ gameId: games[0].id, userId: users[0].id },
			{ gameId: games[0].id, userId: users[1].id },
			{ gameId: games[0].id, userId: users[2].id },
			{ gameId: games[0].id, userId: users[3].id },
			{ gameId: games[2].id, userId: users[0].id },
			{ gameId: games[2].id, userId: users[2].id },
			{ gameId: games[3].id, userId: users[1].id },
			{ gameId: games[3].id, userId: users[3].id },
		]);

		// 初期シーンの設定
		await db.insert(schema.gameInitialScene).values([
			{ gameId: games[0].id, sceneId: scenes[0].id },
			{ gameId: games[1].id, sceneId: scenes[4].id },
			{ gameId: games[2].id, sceneId: scenes[7].id },
			{ gameId: games[3].id, sceneId: scenes[11].id },
			{ gameId: games[4].id, sceneId: scenes[13].id },
		]);

		// シーンの種類を設定
		// goto シーン
		const gotoScenes = await db
			.insert(schema.gotoScene)
			.values([
				{ sceneId: scenes[0].id, nextSceneId: scenes[1].id },
				{ sceneId: scenes[1].id, nextSceneId: scenes[2].id },
				{ sceneId: scenes[4].id, nextSceneId: scenes[5].id },
				{ sceneId: scenes[5].id, nextSceneId: scenes[6].id },
				{ sceneId: scenes[7].id, nextSceneId: scenes[8].id },
				{ sceneId: scenes[8].id, nextSceneId: scenes[9].id },
				{ sceneId: scenes[11].id, nextSceneId: scenes[12].id },
				{ sceneId: scenes[13].id, nextSceneId: scenes[14].id },
			])
			.returning();

		// 選択肢シーンの作成
		const choiceScenes = await db
			.insert(schema.choiceScene)
			.values([{ sceneId: scenes[2].id }, { sceneId: scenes[9].id }])
			.returning();

		// 選択肢の作成
		await db.insert(schema.choice).values([
			// ゲーム1の選択肢
			{
				choiceSceneId: choiceScenes[0].id,
				text: "ヒロインに話しかける",
				nextSceneId: scenes[3].id,
			},
			{
				choiceSceneId: choiceScenes[0].id,
				text: "他のクラスメイトと話す",
				nextSceneId: scenes[3].id,
			},
			// ゲーム3の選択肢
			{
				choiceSceneId: choiceScenes[1].id,
				text: "告白する",
				nextSceneId: scenes[10].id,
			},
			{
				choiceSceneId: choiceScenes[1].id,
				text: "もう少し待つ",
				nextSceneId: scenes[10].id,
			},
		]);

		// エンドシーンの作成
		await db
			.insert(schema.endScene)
			.values([{ sceneId: scenes[3].id }, { sceneId: scenes[10].id }]);

		// イベントの挿入（各シーンごとに複数イベント）
		// ゲーム1の導入シーン用イベント
		const events1 = await db
			.insert(schema.event)
			.values([
				// シーン0のイベント（導入シーン）
				{
					sceneId: scenes[0].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[0].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[0].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				{
					sceneId: scenes[0].id,
					eventType: "bgmStart",
					category: "media",
					orderIndex: "0040",
				},
				// シーン1のイベント（登校シーン）
				{
					sceneId: scenes[1].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[1].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[1].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				{
					sceneId: scenes[1].id,
					eventType: "soundEffect",
					category: "media",
					orderIndex: "0040",
				},
				// シーン2のイベント（選択肢シーン）
				{
					sceneId: scenes[2].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[2].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[2].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				// シーン3のイベント（エンディング）
				{
					sceneId: scenes[3].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[3].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[3].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				{
					sceneId: scenes[3].id,
					eventType: "bgmStart",
					category: "media",
					orderIndex: "0040",
				},
			])
			.returning();

		// ゲーム2のイベント
		const events2 = await db
			.insert(schema.event)
			.values([
				// シーン4のイベント（序章）
				{
					sceneId: scenes[4].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[4].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[4].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				// シーン5のイベント（謎の発見）
				{
					sceneId: scenes[5].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[5].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[5].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				{
					sceneId: scenes[5].id,
					eventType: "soundEffect",
					category: "media",
					orderIndex: "0040",
				},
				// シーン6のイベント（調査開始）
				{
					sceneId: scenes[6].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[6].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[6].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
			])
			.returning();

		// ゲーム3のイベント
		const events3 = await db
			.insert(schema.event)
			.values([
				// シーン7のイベント（再会）
				{
					sceneId: scenes[7].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[7].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[7].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				{
					sceneId: scenes[7].id,
					eventType: "soundEffect",
					category: "media",
					orderIndex: "0040",
				},
				// シーン8のイベント（カフェでの会話）
				{
					sceneId: scenes[8].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[8].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[8].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				// シーン9のイベント（告白シーン）
				{
					sceneId: scenes[9].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[9].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[9].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				{
					sceneId: scenes[9].id,
					eventType: "appearCG",
					category: "cg",
					orderIndex: "0040",
				},
				// シーン10のイベント（エンディング）
				{
					sceneId: scenes[10].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[10].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[10].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
			])
			.returning();

		// ゲーム4のイベント
		const events4 = await db
			.insert(schema.event)
			.values([
				// シーン11のイベント（異世界への召喚）
				{
					sceneId: scenes[11].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[11].id,
					eventType: "effect",
					category: "effect",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[11].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				{
					sceneId: scenes[11].id,
					eventType: "soundEffect",
					category: "media",
					orderIndex: "0040",
				},
				// シーン12のイベント（仲間との出会い）
				{
					sceneId: scenes[12].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[12].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[12].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
			])
			.returning();

		// ゲーム5のイベント
		const events5 = await db
			.insert(schema.event)
			.values([
				// シーン13のイベント（未来学園への入学）
				{
					sceneId: scenes[13].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[13].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[13].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				{
					sceneId: scenes[13].id,
					eventType: "bgmStart",
					category: "media",
					orderIndex: "0040",
				},
				// シーン14のイベント（不思議な実験）
				{
					sceneId: scenes[14].id,
					eventType: "changeBackground",
					category: "background",
					orderIndex: "0010",
				},
				{
					sceneId: scenes[14].id,
					eventType: "appearCharacter",
					category: "character",
					orderIndex: "0020",
				},
				{
					sceneId: scenes[14].id,
					eventType: "textRender",
					category: "message",
					orderIndex: "0030",
				},
				{
					sceneId: scenes[14].id,
					eventType: "soundEffect",
					category: "media",
					orderIndex: "0040",
				},
			])
			.returning();

		// 全イベントを1つの配列にまとめる
		const allEvents = [
			...events1,
			...events2,
			...events3,
			...events4,
			...events5,
		];

		// 背景変更イベント
		await db.insert(schema.changeBackgroundEvent).values([
			{
				eventId: allEvents[0].id,
				backgroundId: assets[4].id, // 教室（昼）
				transitionDuration: 500,
			},
			{
				eventId: allEvents[4].id,
				backgroundId: assets[6].id, // 公園
				transitionDuration: 500,
			},
			{
				eventId: allEvents[8].id,
				backgroundId: assets[5].id, // 教室（夕方）
				transitionDuration: 500,
			},
			{
				eventId: allEvents[11].id,
				backgroundId: assets[4].id, // 教室（昼）
				transitionDuration: 500,
			},
			{
				eventId: allEvents[15].id,
				backgroundId: assets[4].id, // 教室（昼）
				transitionDuration: 500,
			},
			{
				eventId: allEvents[18].id,
				backgroundId: assets[5].id, // 教室（夕方）
				transitionDuration: 500,
			},
			{
				eventId: allEvents[22].id,
				backgroundId: assets[7].id, // カフェ
				transitionDuration: 500,
			},
			{
				eventId: allEvents[26].id,
				backgroundId: assets[6].id, // 公園
				transitionDuration: 500,
			},
			{
				eventId: allEvents[30].id,
				backgroundId: assets[4].id, // 教室（昼）
				transitionDuration: 500,
			},
			{
				eventId: allEvents[34].id,
				backgroundId: assets[6].id, // 公園
				transitionDuration: 500,
			},
			{
				eventId: allEvents[38].id,
				backgroundId: assets[4].id, // 教室（昼）
				transitionDuration: 500,
			},
			{
				eventId: allEvents[42].id,
				backgroundId: assets[5].id, // 教室（夕方）
				transitionDuration: 500,
			},
		]);

		// キャラクター登場イベント
		await db.insert(schema.appearCharacterEvent).values([
			{
				eventId: allEvents[1].id,
				characterId: characters[0].id,
				characterImageId: assets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[5].id,
				characterId: characters[1].id,
				characterImageId: assets[1].id,
				position: [200, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[9].id,
				characterId: characters[1].id,
				characterImageId: assets[1].id,
				position: [200, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[12].id,
				characterId: characters[0].id,
				characterImageId: assets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[16].id,
				characterId: characters[2].id,
				characterImageId: assets[2].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[19].id,
				characterId: characters[0].id,
				characterImageId: assets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[23].id,
				characterId: characters[3].id,
				characterImageId: assets[3].id,
				position: [200, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[27].id,
				characterId: characters[1].id,
				characterImageId: assets[1].id,
				position: [200, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[31].id,
				characterId: characters[0].id,
				characterImageId: assets[0].id,
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[35].id,
				characterId: characters[2].id,
				characterImageId: assets[2].id,
				position: [200, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[39].id,
				characterId: characters[4].id, // 先生
				characterImageId: assets[0].id, // 適当な画像を使用
				position: [0, 0],
				scale: "1",
				transitionDuration: 500,
			},
			{
				eventId: allEvents[43].id,
				characterId: characters[3].id,
				characterImageId: assets[3].id,
				position: [200, 0],
				scale: "1",
				transitionDuration: 500,
			},
		]);

		// テキスト表示イベント
		await db.insert(schema.textRenderEvent).values([
			{
				eventId: allEvents[2].id,
				text: "新しい学校での生活が始まる。どんな出会いが待っているのだろうか。",
				characterName: "主人公",
			},
			{
				eventId: allEvents[6].id,
				text: "おはよう！今日も良い天気ね。",
				characterName: "ヒロイン",
			},
			{
				eventId: allEvents[10].id,
				text: "ねえ、放課後どうする？一緒に帰る？",
				characterName: "ヒロイン",
			},
			{
				eventId: allEvents[13].id,
				text: "これで物語は終わりだ。でも新しい始まりでもある。",
				characterName: "主人公",
			},
			{
				eventId: allEvents[17].id,
				text: "最近、学校で奇妙なことが起きているらしい。",
				characterName: "ライバル",
			},
			{
				eventId: allEvents[20].id,
				text: "図書室で見つけた古い日記...これは？",
				characterName: "主人公",
			},
			{
				eventId: allEvents[24].id,
				text: "あれから10年...まさかあなたに会えるなんて。",
				characterName: "幼なじみ",
			},
			{
				eventId: allEvents[28].id,
				text: "ずっと言いたかったことがあるんだ...",
				characterName: "主人公",
			},
			{
				eventId: allEvents[32].id,
				text: "突然、目の前が光に包まれた...",
				characterName: "主人公",
			},
			{
				eventId: allEvents[36].id,
				text: "ここは...異世界？なぜ自分がここに？",
				characterName: "主人公",
			},
			{
				eventId: allEvents[40].id,
				text: "未来学園へようこそ。ここでは特殊な能力を持つ生徒たちが学んでいます。",
				characterName: "先生",
			},
			{
				eventId: allEvents[44].id,
				text: "この実験が成功すれば、時間を操ることも夢ではない...",
				characterName: "幼なじみ",
			},
		]);

		// BGm開始イベント
		await db.insert(schema.bgmStartEvent).values([
			{
				eventId: allEvents[3].id,
				bgmId: assets[8].id,
				loop: true,
				volume: "0.8",
			},
			{
				eventId: allEvents[14].id,
				bgmId: assets[10].id, // 感動シーン
				loop: true,
				volume: "0.7",
			},
			{
				eventId: allEvents[25].id,
				bgmId: assets[9].id, // 日常シーン
				loop: true,
				volume: "0.6",
			},
			{
				eventId: allEvents[41].id,
				bgmId: assets[8].id, // メインテーマ
				loop: true,
				volume: "0.8",
			},
		]);

		// 効果音イベント
		await db.insert(schema.soundEffectEvent).values([
			{
				eventId: allEvents[7].id,
				soundEffectId: assets[11].id, // ドア開閉音
				loop: false,
				volume: "0.8",
			},
			{
				eventId: allEvents[21].id,
				soundEffectId: assets[12].id, // 足音
				loop: false,
				volume: "0.7",
			},
			{
				eventId: allEvents[37].id,
				soundEffectId: assets[13].id, // 衝撃音
				loop: false,
				volume: "0.9",
			},
			{
				eventId: allEvents[45].id,
				soundEffectId: assets[13].id, // 衝撃音
				loop: false,
				volume: "0.9",
			},
		]);

		// エフェクトイベント
		await db.insert(schema.effectEvent).values([
			{
				eventId: allEvents[33].id,
				effectType: "flash",
				transitionDuration: 500,
			},
		]);

		// CGイベント
		await db.insert(schema.appearCgEvent).values([
			{
				eventId: allEvents[29].id,
				cgImageId: assets[15].id, // 告白シーン
				transitionDuration: 1000,
			},
		]);

		console.log("✅ シードデータの投入が完了しました");
	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
		throw error;
	} finally {
		console.log("🎉 シード投入が完了しました！");
	}
}

if (require.main === module) {
	seedDatabase()
		.then(() => process.exit(0))
		.catch((err) => {
			console.error("致命的なエラーが発生しました:", err);
			process.exit(1);
		});
}

export { seedDatabase };
